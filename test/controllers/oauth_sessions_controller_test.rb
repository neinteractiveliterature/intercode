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

  let(:user) { create(:user) }
  # The frontend app's redirect URIs are derived from the known hosts, so there has to be one
  let(:convention) { create(:convention) }
  let(:frontend_app) do
    convention
    OAuthApplication.find_by(is_intercode_frontend: true) ||
      create(:oauth_application, is_intercode_frontend: true, confidential: false)
  end
  let(:code_verifier) { "a-code-verifier-that-is-long-enough-to-satisfy-pkce-0123456789" }
  let(:code_challenge) { Base64.urlsafe_encode64(Digest::SHA256.digest(code_verifier), padding: false) }
  let(:redirect_uri) { "https://#{convention.domain}/oauth/callback" }
  let(:cookie_name) { OAuthSessionsController::COOKIE_NAME }

  before { https! }

  def create_grant(application: frontend_app)
    Doorkeeper::AccessGrant.create!(
      application: application,
      resource_owner_id: user.id,
      expires_in: 10.minutes,
      redirect_uri: redirect_uri,
      scopes: "public",
      code_challenge: code_challenge,
      code_challenge_method: "S256"
    )
  end

  def exchange_params(grant, **overrides)
    { code: grant.token, redirect_uri: redirect_uri, code_verifier: code_verifier }.merge(overrides)
  end

  # Signs in via the exchange endpoint, leaving the refresh cookie in the integration session's cookie jar
  def sign_in_via_exchange
    post "/oauth_session/exchange", params: exchange_params(create_grant)
    assert_response :success
  end

  def refresh_cookie_header
    Array(response.headers["Set-Cookie"]).join("\n").lines.find { |line| line.start_with?("#{cookie_name}=") }.to_s
  end

  describe "POST /oauth_session/exchange" do
    before { frontend_app }

    it "trades a valid PKCE grant for an access token and sets the refresh token in an HttpOnly cookie" do
      post "/oauth_session/exchange", params: exchange_params(create_grant)

      assert_response :success
      body = response.parsed_body
      assert body["access_token"].present?
      assert_equal "Bearer", body["token_type"]
      assert body["expires_in"].present?
      assert_nil body["refresh_token"], "the refresh token must only ever travel in the cookie"

      cookie = refresh_cookie_header
      assert cookie.present?, "expected the refresh cookie to be set"
      assert_match(/httponly/i, cookie)
      assert_match(/secure/i, cookie)
      assert_match(/samesite=strict/i, cookie)
      assert_match(%r{path=/}i, cookie)
      assert_no_match(/domain=/i, cookie)
    end

    it "requires a code" do
      post "/oauth_session/exchange", params: { redirect_uri: redirect_uri }

      assert_response :bad_request
      assert_equal "invalid_request", response.parsed_body["error"]
    end

    it "rejects a code that matches no grant" do
      post "/oauth_session/exchange", params: { code: "nope", redirect_uri: redirect_uri, code_verifier: code_verifier }

      assert_response :bad_request
      assert_equal "invalid_grant", response.parsed_body["error"]
    end

    it "rejects the wrong PKCE code verifier" do
      post "/oauth_session/exchange", params: exchange_params(create_grant, code_verifier: "#{code_verifier}-wrong")

      assert_response :bad_request
      assert_equal "invalid_grant", response.parsed_body["error"]
      assert refresh_cookie_header.blank?
    end

    it "rejects a mismatched redirect URI" do
      post "/oauth_session/exchange",
           params: exchange_params(create_grant, redirect_uri: "https://evil.example.com/oauth/callback")

      assert_response :bad_request
      assert_equal "invalid_grant", response.parsed_body["error"]
    end

    it "only lets a grant be used once" do
      grant = create_grant
      post "/oauth_session/exchange", params: exchange_params(grant)
      assert_response :success

      post "/oauth_session/exchange", params: exchange_params(grant)
      assert_response :bad_request
      assert_equal "invalid_grant", response.parsed_body["error"]
    end

    it "fails with invalid_client when there is no frontend application" do
      grant = create_grant
      OAuthApplication.where(is_intercode_frontend: true).update_all(is_intercode_frontend: false) # rubocop:disable Rails/SkipsModelValidations

      post "/oauth_session/exchange", params: exchange_params(grant)

      assert_response :bad_request
      assert_equal "invalid_client", response.parsed_body["error"]
    end

    describe "origin checking" do
      it "rejects an origin that is not a known host" do
        post "/oauth_session/exchange",
             params: exchange_params(create_grant),
             headers: {
               "Origin" => "https://evil.example.com"
             }

        assert_response :forbidden
        assert_equal "untrusted origin", response.parsed_body["error_description"]
        assert refresh_cookie_header.blank?
      end

      it "rejects an origin that is not a valid URI" do
        post "/oauth_session/exchange",
             params: exchange_params(create_grant),
             headers: {
               "Origin" => "https://exa mple.com"
             }

        assert_response :forbidden
        assert_equal "invalid origin", response.parsed_body["error_description"]
      end

      it "accepts the origin of a convention's domain" do
        post "/oauth_session/exchange",
             params: exchange_params(create_grant),
             headers: {
               "Origin" => "https://#{convention.domain}"
             }

        assert_response :success
      end

      it "accepts INTERCODE_HOST and its subdomains" do
        original_host = ENV.fetch("INTERCODE_HOST", nil)
        ENV["INTERCODE_HOST"] = "intercode.test"
        %w[https://intercode.test https://www.intercode.test].each do |origin|
          post "/oauth_session/exchange", params: exchange_params(create_grant), headers: { "Origin" => origin }
          assert_response :success, "expected #{origin} to be trusted"
        end

        post "/oauth_session/exchange",
             params: exchange_params(create_grant),
             headers: {
               "Origin" => "https://notintercode.test"
             }
        assert_response :forbidden
      ensure
        ENV["INTERCODE_HOST"] = original_host
      end
    end
  end

  describe "POST /oauth_session/refresh" do
    before { frontend_app }

    it "rotates the refresh cookie and issues a new access token" do
      sign_in_via_exchange
      first_access_token = response.parsed_body["access_token"]
      first_cookie = cookies[cookie_name]

      post "/oauth_session/refresh"

      assert_response :success
      assert response.parsed_body["access_token"].present?
      assert_not_equal first_access_token, response.parsed_body["access_token"]
      assert_nil response.parsed_body["refresh_token"]
      assert cookies[cookie_name].present?
      assert_not_equal first_cookie, cookies[cookie_name], "the refresh token should be rotated"
    end

    it "rejects (and clears the cookie for) a refresh token whose token has been revoked" do
      sign_in_via_exchange
      Doorkeeper::AccessToken.by_refresh_token(cookies[cookie_name]).revoke

      reports = capture_error_reports { post "/oauth_session/refresh" }

      # (Doorkeeper chooses the status for grant errors)
      assert_response :bad_request
      assert_equal "invalid_grant", response.parsed_body["error"]
      assert_equal :grant_rejected, reports.first[:reason]
      assert_equal({ oauth_refresh_failure: "grant_rejected" }, reports.first[:tags])
      assert cookies[cookie_name].blank?
    end

    it "fails with invalid_client when there is no frontend application" do
      sign_in_via_exchange
      OAuthApplication.where(is_intercode_frontend: true).update_all(is_intercode_frontend: false) # rubocop:disable Rails/SkipsModelValidations

      post "/oauth_session/refresh"

      assert_response :bad_request
      assert_equal "invalid_client", response.parsed_body["error"]
    end
  end

  describe "POST /oauth_session/sign_out" do
    before { frontend_app }

    it "revokes the token behind the refresh cookie and clears the cookie" do
      sign_in_via_exchange
      token = Doorkeeper::AccessToken.by_refresh_token(cookies[cookie_name])

      post "/oauth_session/sign_out"

      assert_response :no_content
      assert token.reload.revoked?
      assert cookies[cookie_name].blank?

      post "/oauth_session/refresh"
      assert_response :unauthorized
    end

    it "succeeds without a cookie" do
      post "/oauth_session/sign_out"

      assert_response :no_content
    end

    it "succeeds when the cookie matches no token" do
      cookies[cookie_name] = "refresh-token-with-no-matching-row"

      post "/oauth_session/sign_out"

      assert_response :no_content
    end
  end
end
