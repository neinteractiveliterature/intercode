require "test_helper"

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  include Devise::Test::IntegrationHelpers

  driven_by :cuprite,
            screen_size: [1200, 800],
            options: {
              headless: %w[0 false].exclude?(ENV.fetch("HEADLESS", nil)),
              js_errors: true,
              process_timeout: 30
            }

  self.use_transactional_tests = false

  teardown { DatabaseCleaner.clean }
end
