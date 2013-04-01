module Intercode
  class VirtualHostConstraint
    def matches?(request)
      request.env["intercode.con"]
    end
  end
  
  class FindVirtualHost
    def initialize(app)
      @app = app
    end
    
    def call(env)
      request = Rack::Request.new(env)
      unless request.path =~ %r{\A#{Rails.application.config.assets.prefix}/}
        env["intercode.con"] ||= Con.find_by_domain(request.host)
      end
      
      @app.call env
    end
  end
end