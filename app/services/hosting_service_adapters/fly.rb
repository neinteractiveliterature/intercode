# frozen_string_literal: true
class HostingServiceAdapters::Fly < HostingServiceAdapters::Base
  SMALL_GUEST = { "cpu_kind" => "shared", "cpus" => 1, "memory_mb" => 1024 }.freeze
  # SMALL_GUEST = { "cpu_kind" => "shared", "cpus" => 1, "memory_mb" => 512 }
  MEDIUM_GUEST = { "cpu_kind" => "shared", "cpus" => 4, "memory_mb" => 1024 }.freeze
  LARGE_GUEST = { "cpu_kind" => "performance", "cpus" => 1, "memory_mb" => 2048 }.freeze

  class Machine < HostingServiceAdapters::Instance
    # A machine in any other state (stopped, stopping, suspended, being destroyed) isn't serving traffic
    LIVE_STATES = %w[created starting started replacing].freeze

    attr_reader :id, :state, :config, :region, :instance_id, :name

    def initialize(id:, instance_id:, state:, config:, region:, name:, **args) # rubocop:disable Metrics/ParameterLists
      super(**args)
      @id = id
      @instance_id = instance_id
      @state = state
      @config = config
      @region = region
      @name = name
    end

    def live?
      LIVE_STATES.include?(state)
    end

    # Fly records the release a machine was created or updated by in its metadata
    def release_version
      config.dig("metadata", "fly_release_version").to_i
    end
  end

  # How long a machine has to have been stopped before it's removed. A deploy stops and replaces machines itself, and
  # shouldn't have them taken away from under it.
  STOPPED_MACHINE_GRACE_PERIOD = 10.minutes

  CPU_BALANCE_TREND_WINDOW = "10m"
  CPU_BALANCE_TREND_WINDOW_SECONDS = 10.minutes

  def applicable?
    ENV["FLY_APP_NAME"].present? && ENV["FLY_API_TOKEN"].present?
  end

  def instances_state
    @instances_state ||=
      HostingServiceAdapters::InstancesState.new(
        instances: current_machines.map { |machine| instance_for_machine(machine) }
      )
  end

  # Fly's shared CPUs run on a burst balance that drains whenever usage is above the baseline and throttles the machine
  # to the baseline (6% for shared-cpu-1x) once it's empty. This estimates the time left from each machine's balance and
  # its recent trend. Machines that started or changed within the trend window are skipped, since the window would span
  # their boot, when the balance briefly falls. Needs FLY_METRICS_TOKEN (a read-only org token) and FLY_ORG_SLUG;
  # without them, returns nil.
  def seconds_until_cpu_exhaustion(group:)
    return nil unless metrics_configured?

    machine_ids = settled_burstable_instances(group).map(&:id)
    return nil if machine_ids.empty?

    balances = query_metric_by_instance("fly_instance_cpu_balance{#{app_selector}}")
    trends = query_metric_by_instance("deriv(fly_instance_cpu_balance{#{app_selector}}[#{CPU_BALANCE_TREND_WINDOW}])")

    machine_ids.filter_map { |id| runway_seconds(balances[id], trends[id]) }.min
  rescue Faraday::Error => e
    Rails.logger.warn "Couldn't read Fly CPU balance metrics: #{e.message}"
    nil
  end

  def invalidate_state
    @current_machines = nil
    @instances_state = nil
  end

  def force_refresh_state
    invalidate_state
    instances_state
  end

  # Machines that aren't live don't count: they can't serve traffic, so the group needs replacements for them
  def update_instance_group(group:, type:, count:)
    current_instances = instances_state.find_instances(group:, type:, live: true)

    if current_instances.size < count
      create_machines(group:, type:, count: count - current_instances.size)
      invalidate_state
    elsif current_instances.size > count
      destroy_machines(oldest_first(current_instances).first(current_instances.size - count))
      invalidate_state
    end
  end

  def remove_stopped_instances(groups:)
    stopped = stopped_machines_past_grace_period(groups)
    return if stopped.empty?

    Rails.logger.info "Deleting stopped Fly machine(s): #{stopped.map(&:name).join(", ")}"
    stopped.each do |instance|
      ignoring_missing_machine(instance) do
        machines_api.delete("/v1/apps/#{ENV.fetch("FLY_APP_NAME")}/machines/#{instance.id}")
      end
    end
    invalidate_state
  end

  private

  def stopped_machines_past_grace_period(groups)
    cutoff = STOPPED_MACHINE_GRACE_PERIOD.ago
    instances_state.instances.select do |instance|
      next false unless groups.include?(instance.group) && instance.state == "stopped"

      instance.last_changed_at.present? && instance.last_changed_at < cutoff
    end
  end

  # Which machines to remove first: the ones from the oldest releases, so that during a blue-green deploy (when there
  # are briefly too many) it's the old machines that go, and then the longest-running
  def oldest_first(instances)
    instances.sort_by.with_index do |instance, index|
      [instance.release_version, instance.created_at || Time.zone.at(0), index]
    end
  end

  # New machines are copied from a running machine on the newest release, not from whichever one happens to be first
  def template_machine_for(group)
    candidates = instances_state.find_instances(group:, live: true).presence || instances_state.find_instances(group:)
    candidates.max_by.with_index { |instance, index| [instance.release_version, -index] } ||
      raise("No #{group} machine to copy for a new one")
  end

  def settled_burstable_instances(group)
    cutoff = CPU_BALANCE_TREND_WINDOW_SECONDS.ago
    instances_state
      .find_instances(group:, live: true)
      .reject { |instance| instance.type == :large || (instance.last_changed_at && instance.last_changed_at > cutoff) }
  end

  def metrics_configured?
    ENV["FLY_METRICS_TOKEN"].present? && ENV["FLY_ORG_SLUG"].present?
  end

  def app_selector
    %(app="#{ENV.fetch("FLY_APP_NAME")}")
  end

  def metrics_api
    @metrics_api ||=
      Faraday.new(url: "https://api.fly.io") do |builder|
        builder.request :authorization, "FlyV1", -> { ENV.fetch("FLY_METRICS_TOKEN") }
        builder.response :json
        builder.response :raise_error
        builder.options.timeout = 10
      end
  end

  # Runs an instant query and returns the value of each series, keyed by the machine ID in its "instance" label
  def query_metric_by_instance(query)
    results =
      metrics_api.get("/prometheus/#{ENV.fetch("FLY_ORG_SLUG")}/api/v1/query", query:).body.dig("data", "result") || []
    results.to_h { |series| [series.dig("metric", "instance"), series.dig("value", 1).to_f] }
  end

  def runway_seconds(balance, trend)
    return nil if balance.nil?
    # A throttled machine's balance is flat at zero, so its trend says nothing
    return 0 if balance <= 0

    trend.present? && trend.negative? ? balance / -trend : nil
  end

  def machines_api_base
    @machines_api_base ||= ENV["FLY_PRIVATE_IP"].present? ? "http://_api.internal:4280" : "https://api.machines.dev"
  end

  def machines_api
    @machines_api ||=
      Faraday.new(url: machines_api_base) do |builder|
        builder.request :authorization, "Bearer", -> { ENV.fetch("FLY_API_TOKEN") }
        builder.request :json
        builder.response :json
        builder.response :raise_error
        builder.response :logger, nil, { headers: true, bodies: true, errors: true }
        # (the wait endpoints hold the connection open for up to a minute)
        builder.options.open_timeout = 10
        builder.options.timeout = 90
      end
  end

  def current_machines
    @current_machines ||= machines_api.get("/v1/apps/#{ENV.fetch("FLY_APP_NAME")}/machines").body
  end

  def parse_timestamp(timestamp)
    timestamp.presence&.then { |value| Time.zone.parse(value) }
  end

  def instance_for_machine(machine) # rubocop:disable Metrics/MethodLength
    guest = machine.dig("config", "guest")
    process_group = machine.dig("config", "metadata", "fly_process_group")

    Machine.new(
      id: machine["id"],
      instance_id: machine["instance_id"],
      name: machine["name"],
      state: machine["state"],
      created_at: parse_timestamp(machine["created_at"]),
      updated_at: parse_timestamp(machine["updated_at"]),
      config: machine["config"],
      region: machine["region"],
      group:
        case process_group
        when "web"
          :web
        when "shoryuken"
          :worker
        else
          :other
        end,
      type:
        case guest
        when SMALL_GUEST
          :small
        when MEDIUM_GUEST
          :medium
        when LARGE_GUEST
          :large
        else
          :other
        end
    )
  end

  def guest_config_for_type(type)
    case type
    when :small
      SMALL_GUEST
    when :medium
      MEDIUM_GUEST
    when :large
      LARGE_GUEST
    end
  end

  def fly_process_group_for_group(group)
    case group
    when :web
      "web"
    when :worker
      "shoryuken"
    end
  end

  def machine_create_body(group:, type:)
    template_machine = template_machine_for(group)
    config_template = template_machine.config.merge("guest" => guest_config_for_type(type))
    { config: config_template, region: template_machine.region }
  end

  def create_machines(group:, type:, count:)
    create_body = machine_create_body(group:, type:)

    Rails.logger.info "Creating #{count} #{type} #{group} machine(s)"
    created_machines =
      Array.new(count) { |_n| machines_api.post("/v1/apps/#{ENV.fetch("FLY_APP_NAME")}/machines", create_body).body }
    Rails.logger.info "Created and started Fly machines: #{created_machines.pluck("name").join(", ")}"

    Rails.logger.info "Waiting for all machines to start"
    created_machines.each do |machine|
      machines_api.get("/v1/apps/#{ENV.fetch("FLY_APP_NAME")}/machines/#{machine["id"]}/wait?state=started")
    end

    created_machines
  end

  def destroy_machines(instances)
    instances.each do |instance|
      Rails.logger.info "Stopping Fly machine #{instance.name}"
      ignoring_missing_machine(instance) do
        machines_api.post("/v1/apps/#{ENV.fetch("FLY_APP_NAME")}/machines/#{instance.id}/stop")
      end
    end

    Rails.logger.info "Waiting for all machines to stop"
    instances.each do |instance|
      ignoring_missing_machine(instance) do
        machines_api.get(
          "/v1/apps/#{ENV.fetch("FLY_APP_NAME")}/machines/#{instance.id}/wait?\
state=stopped&instance_id=#{instance.instance_id}"
        )

        Rails.logger.info "Destroying Fly machine #{instance.name}"
        machines_api.delete("/v1/apps/#{ENV.fetch("FLY_APP_NAME")}/machines/#{instance.id}")
      end
    end
  end

  # A machine we're removing can disappear on its own before we get to it, which is the outcome we wanted anyway
  def ignoring_missing_machine(instance)
    yield
  rescue Faraday::ResourceNotFound
    Rails.logger.info "Fly machine #{instance.name} is already gone"
  end
end
