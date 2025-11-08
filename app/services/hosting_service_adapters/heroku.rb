class HostingServiceAdapters::Heroku < HostingServiceAdapters::Base
  def applicable?
    ENV["HEROKU_APP_NAME"].present? && ENV["HEROKU_API_TOKEN"].present?
  end

  def instances_state # rubocop:disable Metrics/MethodLength
    @instances_state ||=
      begin
        formation = client.formation.list(ENV.fetch("HEROKU_APP_NAME"))
        instances =
          formation.flat_map do |dyno_group|
            group =
              case dyno_group["type"]
              when "web"
                :web
              when "shoryuken"
                :worker
              else
                :other
              end

            type =
              case dyno_group["dyno_size"]["name"]
              when "eco", "basic", "standard-1X"
                :small
              when "standard-2X"
                :large
              else
                :other
              end

            Array.new(dyno_group["count"]) { |_n| HostingServiceAdapters::Instance.new(group:, type:) }
          end

        HostingServiceAdapters::InstancesState.new(instances:)
      end
  end

  def update_instance_group(group:, type:, count:)
    dyno_type =
      case group
      when :web
        "web"
      when :worker
        "shoryuken"
      end

    dyno_size =
      if type == :small
        count == 1 ? "basic" : "standard-1X"
      elsif type == :large
        "standard-2X"
      end

    client.formation.batch_update(
      ENV.fetch("HEROKU_APP_NAME"),
      { updates: [{ type: dyno_type, size: dyno_size, quantity: count }] }
    )
  end

  private

  def client
    @client ||= PlatformAPI.connect_oauth(ENV.fetch("HEROKU_API_TOKEN"))
  end
end
