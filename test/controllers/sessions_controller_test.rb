# frozen_string_literal: true
require "test_helper"

class SessionsControllerTest < ActionDispatch::IntegrationTest
  let(:user) { create(:user, password: "password", password_confirmation: "password") }

  def post_sign_in(password: "password", json: false)
    headers = json ? { "Accept" => "application/json" } : {}
    post user_session_path, params: { user: { email: user.email, password: password } }, headers: headers
  end

  describe "JSON sign-in (the SPA path)" do
    it "returns the post-sign-in location as JSON instead of redirecting" do
      post_sign_in(json: true)

      assert_response :ok
      assert response.parsed_body.key?("location"), "expected a location in the JSON response"
      # Must not be a redirect — fetch() would follow it cross-origin and hit CORS.
      assert_not response.redirect?
    end
  end

  describe "JSON sign-in with an untrusted return location" do
    it "sanitizes an other-host location down to the root path" do
      get new_user_session_path(user_return_to: "https://evil.example.com/phish")
      post_sign_in(json: true)

      assert_response :ok
      assert_equal root_path, response.parsed_body["location"]
    end
  end

  describe "JSON sign-in with bad credentials" do
    it "returns a JSON error (not a redirect) for inline display" do
      post_sign_in(password: "wrong", json: true)

      assert_response :unauthorized
      assert response.parsed_body.key?("error")
    end
  end

  describe "navigational sign-in (no-JS fallback)" do
    it "still issues an HTTP redirect" do
      post_sign_in

      assert response.redirect?
    end
  end
end
