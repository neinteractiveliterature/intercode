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
      warn "\nURL at failure: #{page.current_url}"
      warn "Page title: #{page.title}"
      body_snippet = page.html.to_s.gsub(/\s+/, " ").slice(0, 500)
      warn "Page body (first 500 chars): #{body_snippet}"
      messages = page.driver.console_messages
      if messages.any?
        warn "\nBrowser console output:"
        messages.each { |m| warn "  [#{m[:type]}] #{m[:text]}" }
      else
        warn "No browser console messages captured."
      end
    end
    DatabaseCleaner.clean
  end
end
