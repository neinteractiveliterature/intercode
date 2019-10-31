require_relative 'boot'

require 'rails/all'
require File.expand_path('../../lib/intercode/dynamic_cookie_domain', __FILE__)
require File.expand_path('../../lib/intercode/virtual_host_constraint', __FILE__)

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Intercode
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.2
    config.autoloader = :zeitwerk

    config.hosts << ENV['ASSETS_HOST'] if ENV['ASSETS_HOST'].present?
    config.hosts << /.*#{Regexp.escape(ENV['INTERCODE_HOST'])}/ if ENV['INTERCODE_HOST'].present?
    config.hosts << ->(host) do
      Convention.where(domain: host).any?
    end

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    config.active_job.queue_adapter = :shoryuken
    config.active_job.queue_name_prefix = "intercode_#{Rails.env}"

    config.middleware.use Intercode::DynamicCookieDomain
    config.middleware.use Intercode::FindVirtualHost
    config.middleware.use Rack::Deflater

    config.skylight.probes += %w[active_job graphql]

    # To enable tsvectors and triggers; hopefully can get rid of this at some point :(
    config.active_record.schema_format = :sql

    config.generators do |g|
      g.template_engine :erb
      g.test_framework :test_unit, fixture: false
      g.stylesheets     false
      g.javascripts     false
    end

    config.assets.initialize_on_precompile = false

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    %w[liquid_drops presenters services].each do |subdir|
      config.eager_load_paths << Rails.root.join("app/#{subdir}")
    end

    config.to_prepare do
      # Only Applications list
      Doorkeeper::ApplicationsController.layout 'doorkeeper/admin'

      # Only Authorization endpoint
      Doorkeeper::AuthorizationsController.layout 'application'

      # Only Authorized Applications
      Doorkeeper::AuthorizedApplicationsController.layout 'application'

      DeviseController.respond_to :html, :json
    end
  end
end
