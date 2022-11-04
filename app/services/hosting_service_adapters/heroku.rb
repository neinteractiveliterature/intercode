class HostingServiceAdapters::Heroku < HostingServiceAdapters::Base
  def applicable?
    ENV["HEROKU_APP_NAME"].present? && ENV["HEROKU_API_TOKEN"].present?
  end

  def fetch_instance_count
    client.formation.info(ENV["HEROKU_APP_NAME"], "web").fetch("quantity")
  end

  def update_instance_count(instance_count)
    client.formation.update(
      ENV["HEROKU_APP_NAME"],
      "web",
      { size: instance_count == 1 ? "hobby" : "standard-1X", quantity: instance_count }
    )
  end

  private

  def client
    @client ||= PlatformAPI.connect_oauth(ENV["HEROKU_API_TOKEN"])
  end
end
