# frozen_string_literal: true
require "test_helper"

# The SPA runs on a convention's own domain and calls back to the backend with credentials, so the Rack::Cors rules in
# config/initializers/cors.rb are load-bearing.  These tests drive the real middleware stack (including
# Intercode::FindVirtualHost, which has to run first) so that a rack-cors upgrade that changes origin matching,
# preflight handling, or credentialed responses gets caught here.
class CorsTest < ActionDispatch::IntegrationTest
  let(:convention) { create(:convention) }
  let(:convention_origin) { "https://#{convention.domain}" }
  let(:unknown_origin) { "https://evil.example.org" }

  def allow_origin = response.headers["Access-Control-Allow-Origin"]
  def allow_credentials = response.headers["Access-Control-Allow-Credentials"]

  def with_intercode_host(host)
    old_host = ENV.fetch("INTERCODE_HOST", nil)
    ENV["INTERCODE_HOST"] = host
    yield
  ensure
    ENV["INTERCODE_HOST"] = old_host
  end

  def preflight(path, origin:, method: "POST", request_headers: "content-type,x-csrf-token")
    headers = { "Origin" => origin, "Access-Control-Request-Method" => method }
    headers["Access-Control-Request-Headers"] = request_headers if request_headers
    options path, headers: headers
  end

  describe "a request to a convention's domain" do
    before { host! convention.domain }

    it "echoes the requesting origin and allows credentials, whatever the origin is" do
      get "/authenticity_tokens", headers: { "Origin" => unknown_origin }

      assert_equal unknown_origin, allow_origin
      assert_equal "true", allow_credentials
    end
  end

  describe "a request to the root site" do
    it "allows a convention's domain as an origin, with credentials" do
      get "/authenticity_tokens", headers: { "Origin" => convention_origin }

      assert_equal convention_origin, allow_origin
      assert_equal "true", allow_credentials
    end

    it "does not allow an origin that isn't a convention domain" do
      get "/authenticity_tokens", headers: { "Origin" => unknown_origin }

      assert_nil allow_origin
      assert_nil allow_credentials
    end

    it "allows INTERCODE_HOST and its subdomains" do
      with_intercode_host("intercode.test") do
        get "/authenticity_tokens", headers: { "Origin" => "https://intercode.test" }
        assert_equal "https://intercode.test", allow_origin

        get "/authenticity_tokens", headers: { "Origin" => "https://sub.intercode.test" }
        assert_equal "https://sub.intercode.test", allow_origin
      end
    end

    it "doesn't treat a host that merely ends with INTERCODE_HOST as a subdomain of it" do
      with_intercode_host("intercode.test") do
        get "/authenticity_tokens", headers: { "Origin" => "https://notintercode.test" }

        assert_nil allow_origin
      end
    end

    it "ignores a malformed Origin instead of raising" do
      # Production always sets INTERCODE_HOST; with it unset, an origin with no host would compare nil == nil
      with_intercode_host("intercode.test") do
        get "/authenticity_tokens", headers: { "Origin" => "ht!tp://not a uri" }

        assert_response :success
        assert_nil allow_origin
      end
    end

    it "sends no CORS headers when the request has no Origin" do
      get "/authenticity_tokens"

      assert_response :success
      assert_nil allow_origin
    end
  end

  describe "preflight requests" do
    it "approves a credentialed POST to /graphql from a convention's domain" do
      preflight "/graphql", origin: convention_origin

      assert_response :success
      assert_equal convention_origin, allow_origin
      assert_equal "true", allow_credentials
      assert_includes response.headers["Access-Control-Allow-Methods"].to_s.upcase.split(/,\s*/), "POST"
      assert_includes response.headers["Access-Control-Allow-Headers"].to_s.downcase, "x-csrf-token"
    end

    it "doesn't approve a method that the resource doesn't list" do
      preflight "/graphql", origin: convention_origin, method: "DELETE"

      assert_not_includes response.headers["Access-Control-Allow-Methods"].to_s.upcase.split(/,\s*/), "DELETE"
    end

    it "gives an unknown origin no approval" do
      preflight "/graphql", origin: unknown_origin

      assert_nil allow_origin
      assert_nil response.headers["Access-Control-Allow-Methods"]
    end
  end

  describe "routes without credentials" do
    it "allows direct uploads but doesn't send Allow-Credentials" do
      # This resource doesn't list any allowed request headers, so only a preflight that asks for none is approved
      preflight "/rails/active_storage/direct_uploads", origin: convention_origin, request_headers: nil

      assert_equal convention_origin, allow_origin
      assert_nil allow_credentials
    end
  end
end
