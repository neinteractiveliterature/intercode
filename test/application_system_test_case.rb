# frozen_string_literal: true
require "test_helper"

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  include Devise::Test::IntegrationHelpers

  Capybara.default_max_wait_time = 10

  driven_by :cuprite,
            screen_size: [1200, 800],
            options: {
              headless: %w[0 false].exclude?(ENV.fetch("HEADLESS", nil)),
              js_errors: true,
              process_timeout: 30
            }

  self.use_transactional_tests = false

  teardown do
    if failures.any?
      messages = page.driver.console_messages
      if messages.any?
        warn "\nBrowser console output:"
        messages.each { |m| warn "  [#{m[:type]}] #{m[:text]}" }
      end
    end
    DatabaseCleaner.clean
  end
end
