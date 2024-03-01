module Intercode
  class RedirectUrl
    def initialize(app)
      @app = app
    end

    def call(env)
      request = Rack::Request.new(env)
      redirect_url = ::RedirectUrl.joins(:domain).where(path: request.path, domain: { name: request.host }).first

      if redirect_url
        [302, { "Location" => redirect_url.destination, "Content-Type" => "text/html", "Content-Length" => "0" }, []]
      else
        @app.call env
      end
    end
  end
end
