# frozen_string_literal: true
require "test_helper"

class ClientConfigurationControllerTest < ActionDispatch::IntegrationTest
  it "serves the OIDC endpoints same-origin so the SPA needn't fetch cross-origin discovery" do
    get "/client_configuration"

    assert_response :ok
    config = response.parsed_body
    issuer = config["oidc_issuer_url"]

    assert issuer.present?, "expected an issuer URL"
    # Endpoints are absolute URLs on the *issuer* host (not whatever host requested this),
    # built from the issuer so a convention page gets the root-site endpoints.
    assert config["oidc_authorization_endpoint"].start_with?(issuer)
    assert config["oidc_authorization_endpoint"].end_with?("/oauth/authorize")
    assert config["oidc_end_session_endpoint"].start_with?(issuer)
    assert config["oidc_end_session_endpoint"].end_with?("/users/sign_out")
  end
end
