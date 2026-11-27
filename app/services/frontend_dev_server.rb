# frozen_string_literal: true

# The framework-mode development server (`yarn start`), which serves the app and proxies Rails' paths back to Rails.
# Rails still owns some URLs that the app renders (the Devise pages, and whatever under a proxied prefix falls through
# to the catch-all route). For those, Rails hands back the dev server's page to requests that came through its proxy,
# and redirects the ones that came to Rails directly. Set FRONTEND_DEV_SERVER_PORT to turn this on; never in production.
module FrontendDevServer
  class << self
    def port
      return if Rails.env.production?

      ENV["FRONTEND_DEV_SERVER_PORT"].presence&.to_i
    end

    def enabled?
      port.present?
    end

    # The proxy passes the Host header through, so the port tells the two apart
    def proxied?(request)
      request.port == port
    end

    def url_for(request)
      "https://#{request.host}:#{port}#{request.fullpath}"
    end

    # The development server renders the same page for every path
    def shell
      Net::HTTP.start("localhost", port, use_ssl: true, ca_file: Rails.root.join("dev_ca.crt").to_s) do |http|
        response = http.get("/", "Accept" => "text/html")
        response.value # raises unless the response is a success
        response.body
      end
    rescue SystemCallError => e
      raise e.class, "Couldn't reach the frontend development server on port #{port}. Is `yarn start` running?"
    end
  end
end
