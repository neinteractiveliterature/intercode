# Adapted from https://stackoverflow.com/questions/4060333/what-does-rails-3-session-store-domain-all-really-do
module Intercode
  class DynamicCookieDomain
    def initialize(app)
      @app = app
    end

    def call(env)
      host = env['HTTP_HOST']&.split(':')&.first
      return :all unless host

      second_level_host = second_level_domain(host)
      env['rack.session.options'][:domain] = if second_level_host.include?('.')
        ".#{second_level_host}"
      else
        :all
      end

      @app.call(env)
    end

    def second_level_domain(host)
      host.split('.').reverse.take(2).reverse.join('.')
    end
  end
end
