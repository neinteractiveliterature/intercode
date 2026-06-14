# frozen_string_literal: true
require "test_helper"

class OAuthSessionsControllerTest < ActionDispatch::IntegrationTest
  # Captures the structured `extra` payloads passed to ErrorReporting.info while
  # the block runs, so we can assert the refresh endpoint instruments failures.
  def capture_error_reports(&)
    reports = []
    ErrorReporting.stub(:info, ->(_message, **extra) { reports << extra }, &)
    reports
  end

  describe "POST /oauth_session/refresh instrumentation" do
    it "reports cookie_absent when there's no refresh cookie" do
      reports = capture_error_reports { post "/oauth_session/refresh" }

      assert_response :unauthorized
      assert_equal 1, reports.length
      assert_equal :cookie_absent, reports.first[:reason]
      assert_equal({ oauth_refresh_failure: "cookie_absent" }, reports.first[:tags])
    end

    it "reports token_not_found when the cookie references no access token row" do
      # This is the case that would point at the nightly cleanup pruning a token
      # the cookie still references.
      cookies[OAuthSessionsController::COOKIE_NAME] = "refresh-token-with-no-matching-row"

      reports = capture_error_reports { post "/oauth_session/refresh" }

      assert_response :unauthorized
      assert_equal 1, reports.length
      assert_equal :token_not_found, reports.first[:reason]
    end
  end
end
