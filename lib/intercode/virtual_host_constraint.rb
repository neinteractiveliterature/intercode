module Intercode
  class VirtualHostConstraint
    def matches?(request)
      request.env["intercode.convention"]
    end
  end

  class << self
    attr_accessor :overridden_virtual_host_domain
  end

  def self.with_virtual_host_domain(domain)
    self.overridden_virtual_host_domain = domain

    begin
      yield
    ensure
      self.overridden_virtual_host_domain = nil
    end
  end

  class FindVirtualHost
    def initialize(app)
      @app = app
    end

    def call(env)
      request = Rack::Request.new(env)
      unless request.path =~ %r{\A#{Rails.application.config.assets.prefix}/}
        env["intercode.convention"] ||= Convention.find_by(
          domain: Intercode.overridden_virtual_host_domain ||
          request.get_header('HTTP_X_INTERCODE_CONVENTION_DOMAIN') ||
          request.host
        )

        if ENV["FIND_VIRTUAL_HOST_DEBUG"].present?
          if env["intercode.convention"]
            Rails.logger.info "Intercode::FindVirtualHost: request to #{request.host} mapped to
#{env["intercode.convention"].name}"
          else
            Rails.logger.info "Intercode::FindVirtualHost: request to #{request.host} mapped to root site"
          end
        end
      end

      @app.call env
    end
  end
end
