class HostingServiceAdapters::Render < HostingServiceAdapters::Base
  def applicable?
    ENV["RENDER_API_KEY"].present? && ENV["RENDER_SERVICE_ID"].present?
  end

  def fetch_instance_count
    url = URI("https://api.render.com/v1/services/#{ENV.fetch("RENDER_SERVICE_ID")}")
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request["Accept"] = "application/json"
    request["Authorization"] = "Bearer #{ENV.fetch("RENDER_API_KEY")}"

    response = http.request(request)
    raise response.body unless response.is_a?(Net::HTTPSuccess)

    body = JSON.parse(response.body)
    body["serviceDetails"]["numInstances"]
  end

  def update_instance_count(instance_count)
    url = URI("https://api.render.com/v1/services/#{ENV.fetch("RENDER_SERVICE_ID")}/scale")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(url)
    request["Accept"] = "application/json"
    request["Content-Type"] = "application/json"
    request["Authorization"] = "Bearer #{ENV.fetch("RENDER_API_KEY")}"
    request.body = JSON.dump({ numInstances: instance_count })

    response = http.request(request)
    raise response.body unless response.is_a?(Net::HTTPSuccess)

    deploy_service
  end

  private

  def deploy_service
    url = URI("https://api.render.com/v1/services/#{ENV.fetch("RENDER_SERVICE_ID")}/deploys")
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(url)
    request["Accept"] = "application/json"
    request["Authorization"] = "Bearer #{ENV.fetch("RENDER_API_KEY")}"

    response = http.request(request)
    raise response.body unless response.is_a?(Net::HTTPSuccess)
  end
end
