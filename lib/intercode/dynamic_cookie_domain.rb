# Adapted from https://stackoverflow.com/questions/4060333/what-does-rails-3-session-store-domain-all-really-do
module Intercode
  class DynamicCookieDomain
    def initialize(app)
      @app = app
    end

    def call(env)
      host = env['HTTP_HOST']&.split(':')&.first
      return :all unless host

      app_level_host = app_level_domain(host)
      env['rack.session.options'][:domain] = if app_level_host.include?('.')
        app_level_host
      else
        :all
      end

      @app.call(env)
    end

    def app_level_domain(host)
      levels = if host =~ /herokuapp\.com\z/
        3
      else
        2
      end

      host.split('.').reverse.take(levels).reverse.join('.')
    end
  end
end
