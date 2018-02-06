module Intercode
  class VirtualHostConstraint
    def matches?(request)
      request.env['intercode.convention']
    end
  end

  class FindVirtualHost
    def initialize(app)
      @app = app
    end

    def call(env)
      request = Rack::Request.new(env)
      unless request.path =~ %r{\A#{Rails.application.config.assets.prefix}/}
        env['intercode.convention'] ||= Convention.find_by(domain: request.host)
      end

      @app.call env
    end
  end
end
