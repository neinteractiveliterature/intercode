require_relative "boot"

require "rails/all"
require File.expand_path("lib/intercode/dynamic_cookie_domain", Rails.root)
require File.expand_path("lib/intercode/redirect_url", Rails.root)
require File.expand_path("lib/intercode/virtual_host_constraint", Rails.root)

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Intercode
  class Application < Rails::Application
    config.load_defaults 7.0

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w[assets tasks])

    config.hosts << ENV.fetch("ASSETS_HOST", nil) if ENV["ASSETS_HOST"].present?
    config.hosts << /.*#{Regexp.escape(ENV.fetch("INTERCODE_HOST", nil))}/ if ENV["INTERCODE_HOST"].present?
    config.hosts << ->(host) { Convention.where(domain: host).any? }
    config.host_authorization = { exclude: ->(request) { request.path =~ %r{\A/healthz(\z|/)} } }

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    config.active_job.queue_adapter = :shoryuken
    config.active_job.queue_name_prefix = "intercode_#{Rails.env}"

    config.middleware.use Intercode::RedirectUrl
    config.middleware.use Intercode::DynamicCookieDomain
    config.middleware.use Intercode::FindVirtualHost
    config.middleware.use Rack::Deflater

    config.skylight.probes += %w[active_job graphql] if config.respond_to?(:skylight)

    # To enable tsvectors and triggers; hopefully can get rid of this at some point :(
    config.active_record.schema_format = :sql

    config.generators do |g|
      g.template_engine :erb
      g.test_framework :test_unit, fixture: false
      g.stylesheets false
      g.javascripts false
    end

    config.assets.initialize_on_precompile = false

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    %w[liquid_drops notifiers presenters services].each do |subdir|
      config.eager_load_paths << Rails.root.join("app/#{subdir}")
    end

    config.to_prepare do
      # Only Applications list
      Doorkeeper::ApplicationsController.layout "doorkeeper/admin"

      # Only Authorization endpoint
      Doorkeeper::AuthorizationsController.layout "application"

      # Only Authorized Applications
      Doorkeeper::AuthorizedApplicationsController.layout "application"

      DeviseController.respond_to :html, :json
    end
  end
end
