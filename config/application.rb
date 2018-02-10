require File.expand_path('../boot', __FILE__)

require 'rails/all'
require File.expand_path('../../lib/intercode/virtual_host_constraint', __FILE__)

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Intercode
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    config.active_job.queue_adapter = :sidekiq

    config.middleware.use Intercode::FindVirtualHost

    config.generators do |g|
      g.template_engine :erb
      g.test_framework :test_unit, fixture: false
      g.stylesheets     false
      g.javascripts     false
    end

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    %w(liquid_drops presenters responders services).each do |subdir|
      config.eager_load_paths << Rails.root.join("app/#{subdir}")
    end
  end
end
