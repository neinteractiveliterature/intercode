class HostingServiceAdapters::Fly < HostingServiceAdapters::Base
  SMALL_GUEST = { "cpu_kind" => "shared", "cpus" => 1, "memory_mb" => 512 }
  LARGE_GUEST = { "cpu_kind" => "performance", "cpus" => 1, "memory_mb" => 2048 }

  class Machine < HostingServiceAdapters::Instance
    attr_reader :id, :state, :config, :region, :instance_id, :name

    def initialize(id:, instance_id:, state:, config:, region:, name:, **args)
      super(**args)
      @id = id
      @instance_id = instance_id
      @state = state
      @config = config
      @region = region
      @name = name
    end
  end

  def applicable?
    ENV["FLY_APP_NAME"].present? && ENV["FLY_API_TOKEN"].present?
  end

  def instances_state
    @instances_state ||=
      HostingServiceAdapters::InstancesState.new(
        instances: current_machines.map { |machine| instance_for_machine(machine) }
      )
  end

  def invalidate_state
    @current_machines = nil
    @instances_state = nil
  end

  def force_refresh_state
    invalidate_state
    instances_state
  end

  def update_instance_group(group:, type:, count:)
    current_instances = instances_state.find_instances(group:, type:)

    if current_instances.size < count
      create_machines(group:, type:, count: count - current_instances.size)
      invalidate_state
    elsif current_instances.size > count
      destroy_machines(current_instances.first(current_instances.size - count))
      invalidate_state
    end
  end

  private

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
      end
  end

  def current_machines
    @current_machines ||= machines_api.get("/v1/apps/#{ENV.fetch("FLY_APP_NAME")}/machines").body
  end

  def instance_for_machine(machine) # rubocop:disable Metrics/MethodLength
    guest = machine.dig("config", "guest")
    process_group = machine.dig("config", "metadata", "fly_process_group")

    Machine.new(
      id: machine["id"],
      instance_id: machine["instance_id"],
      name: machine["name"],
      state: machine["state"],
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
    template_machine = instances_state.find_instances(group:).first
    config_template =
      template_machine.config.merge(
        "guest" => guest_config_for_type(type),
        "metadata" => {
          "fly_process_group" => fly_process_group_for_group(group)
        }
      )
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
      machines_api.post("/v1/apps/#{ENV.fetch("FLY_APP_NAME")}/machines/#{instance.id}/stop")
    end

    Rails.logger.info "Waiting for all machines to stop"
    instances.each do |instance|
      machines_api.get(
        "/v1/apps/#{ENV.fetch("FLY_APP_NAME")}/machines/#{instance.id}/wait?\
state=stopped&instance_id=#{instance.instance_id}"
      )

      Rails.logger.info "Destroying Fly machine #{instance.name}"
      machines_api.delete("/v1/apps/#{ENV.fetch("FLY_APP_NAME")}/machines/#{instance.id}")
    end
  end
end
