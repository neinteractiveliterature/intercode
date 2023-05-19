class HostingServiceAdapters::Heroku < HostingServiceAdapters::Base
  def applicable?
    ENV["HEROKU_APP_NAME"].present? && ENV["HEROKU_API_TOKEN"].present?
  end

  def fetch_instance_count
    client.formation.info(ENV.fetch("HEROKU_APP_NAME"), "web").fetch("quantity")
  end

  def update_instance_count(instance_count)
    instance_size = instance_count == 1 ? "basic" : "standard-1X"
    client.formation.batch_update(
      ENV.fetch("HEROKU_APP_NAME"),
      {
        updates: [
          { type: "shoryuken", size: instance_size },
          { type: "web", size: instance_size, quantity: instance_count }
        ]
      }
    )
  end

  private

  def client
    @client ||= PlatformAPI.connect_oauth(ENV.fetch("HEROKU_API_TOKEN"))
  end
end
