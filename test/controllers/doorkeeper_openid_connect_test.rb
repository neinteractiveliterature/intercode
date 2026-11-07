# frozen_string_literal: true
require "test_helper"

# Intercode is an OpenID Connect provider (via doorkeeper-openid_connect), but nothing else in the suite exercises that
# part of the app.  These tests drive the real endpoints so that gem upgrades that change discovery, signing, the
# authorization prepends, or the claims pipeline get caught here and not by a relying party.
class DoorkeeperOpenidConnectTest < ActionDispatch::IntegrationTest
  let(:user) { create(:user) }
  let(:application) { create(:oauth_application, confidential: true) }
  let(:redirect_uri) { application.redirect_uri }
  let(:code_verifier) { "a-code-verifier-that-is-long-enough-to-satisfy-pkce-0123456789" }
  let(:code_challenge) { Base64.urlsafe_encode64(Digest::SHA256.digest(code_verifier), padding: false) }

  before do
    https!
    create(:root_site)
  end

  def authorize(response_type:, scope: "openid public", **extra)
    sign_in user
    post oauth_authorization_path,
         params: {
           client_id: application.uid,
           redirect_uri: redirect_uri,
           response_type: response_type,
           scope: scope,
           state: "some-state",
           nonce: "some-nonce",
           code_challenge: code_challenge,
           code_challenge_method: "S256"
         }.merge(extra)
  end

  def redirect_params(part)
    Rack::Utils.parse_query(URI.parse(response.location).public_send(part))
  end

  # Runs the whole code flow (sign in, authorize, trade the code at the token endpoint) and returns the token response
  def exchange_code_for_tokens(scope: "openid public")
    authorize(response_type: "code", scope: scope)
    assert_response :redirect

    post oauth_token_path,
         params: {
           grant_type: "authorization_code",
           code: redirect_params(:query).fetch("code"),
           redirect_uri: redirect_uri,
           client_id: application.uid,
           client_secret: application.plaintext_secret || application.secret,
           code_verifier: code_verifier
         }
    assert_response :success
    response.parsed_body
  end

  def jwks_keys
    get oauth_discovery_keys_path
    assert_response :success
    response.parsed_body.fetch("keys")
  end

  def decode_id_token(id_token)
    jwk = JWT::JWK.import(jwks_keys.first)
    JWT.decode(id_token, jwk.verify_key, true, algorithms: ["RS256"], aud: application.uid, verify_aud: true).first
  end

  describe "discovery" do
    it "serves the OpenID Connect configuration with this server's endpoints" do
      get oauth_discovery_provider_path

      assert_response :success
      config = response.parsed_body
      assert_equal Doorkeeper::OpenidConnect.configuration.issuer.call, config["issuer"]
      assert_equal oauth_authorization_url(protocol: :https), config["authorization_endpoint"]
      assert_equal oauth_token_url(protocol: :https), config["token_endpoint"]
      assert_equal oauth_userinfo_url(protocol: :https), config["userinfo_endpoint"]
      assert_equal oauth_discovery_keys_url(protocol: :https), config["jwks_uri"]
      assert_equal destroy_user_session_url(protocol: :https), config["end_session_endpoint"]
      assert_includes config["scopes_supported"], "openid"
      assert_includes config["response_types_supported"], "code"
      assert_includes config["response_types_supported"], "id_token"
      assert_equal ["public"], config["subject_types_supported"]
      assert_equal ["RS256"], config["id_token_signing_alg_values_supported"]
    end

    it "serves the signing key as a JWKS" do
      keys = jwks_keys

      assert_equal 1, keys.length
      assert_equal "RSA", keys.first["kty"]
      assert_equal "RS256", keys.first["alg"]
      assert_equal "sig", keys.first["use"]
      assert keys.first["kid"].present?
      assert_nil keys.first["d"], "the private exponent must never be published"
    end
  end

  describe "the authorization code flow" do
    it "issues an ID token signed with the published key that identifies the user" do
      tokens = exchange_code_for_tokens

      assert tokens["access_token"].present?
      claims = decode_id_token(tokens.fetch("id_token"))
      assert_equal Doorkeeper::OpenidConnect.configuration.issuer.call, claims["iss"]
      assert_equal user.id.to_s, claims["sub"]
      assert_equal application.uid, claims["aud"]
      assert_equal "some-nonce", claims["nonce"]
      assert claims["exp"] > Time.now.to_i
      assert claims["iat"].present?
      assert claims["auth_time"].present?
    end

    it "does not issue an ID token unless the openid scope was requested" do
      tokens = exchange_code_for_tokens(scope: "public")

      assert tokens["access_token"].present?
      assert_nil tokens["id_token"]
    end
  end

  describe "the implicit flow" do
    it "returns an ID token in the redirect fragment" do
      authorize(response_type: "id_token")

      assert_response :redirect
      assert response.location.start_with?(redirect_uri)
      fragment = redirect_params(:fragment)
      assert_equal "some-state", fragment["state"]
      claims = decode_id_token(fragment.fetch("id_token"))
      assert_equal user.id.to_s, claims["sub"]
      assert_equal "some-nonce", claims["nonce"]
    end
  end

  describe "GET /oauth/userinfo" do
    it "returns the subject for an access token that has the openid scope" do
      get oauth_userinfo_path,
          headers: {
            "Authorization" => "Bearer #{exchange_code_for_tokens.fetch("access_token")}"
          }

      assert_response :success
      assert_equal user.id.to_s, response.parsed_body["sub"]
    end

    it "rejects a request with no access token" do
      get oauth_userinfo_path

      assert_response :unauthorized
    end

    it "rejects an access token that doesn't exist" do
      get oauth_userinfo_path, headers: { "Authorization" => "Bearer not-a-real-token" }

      assert_response :unauthorized
    end

    it "rejects an access token that lacks the openid scope" do
      access_token = exchange_code_for_tokens(scope: "public").fetch("access_token")

      get oauth_userinfo_path, headers: { "Authorization" => "Bearer #{access_token}" }

      assert_response :forbidden
    end
  end
end
