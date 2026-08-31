# frozen_string_literal: true
require "test_helper"

class RegistrationsControllerTest < ActionDispatch::IntegrationTest
  def sign_up_params(email: "new-user@example.com")
    {
      user: {
        first_name: "New",
        last_name: "User",
        email: email,
        password: "correcthorsebattery",
        password_confirmation: "correcthorsebattery"
      }
    }
  end

  it "rejects sign-up when no captcha token is given" do
    create(:root_site)

    post user_registration_path, params: sign_up_params, headers: { "Accept" => "application/json" }

    assert_response :unprocessable_entity
    assert_not User.exists?(email: "new-user@example.com")
  end

  it "allows sign-up without a captcha token when disable_captcha is set" do
    create(:root_site, disable_captcha: true)

    post user_registration_path, params: sign_up_params, headers: { "Accept" => "application/json" }

    assert_response :success
    assert User.exists?(email: "new-user@example.com")
  end

  it "rejects sign-up when TurnstileVerificationService reports failure" do
    create(:root_site)
    service_double = Minitest::Mock.new
    service_double.expect(:call, CivilService::Result.failure)

    TurnstileVerificationService.stub(:new, ->(**) { service_double }) do
      post(
        user_registration_path,
        params: sign_up_params.merge("cf-turnstile-response": "a-token"),
        headers: {
          "Accept" => "application/json"
        }
      )
    end

    assert_response :unprocessable_entity
    assert_not User.exists?(email: "new-user@example.com")
    service_double.verify
  end
end
