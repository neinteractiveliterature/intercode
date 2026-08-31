# frozen_string_literal: true
require "test_helper"

class TurnstileVerificationServiceTest < ActiveSupport::TestCase
  def stubbed_connection(success:, hostname:, error_codes: [])
    Faraday.new do |builder|
      builder.adapter :test do |stub|
        stub.post("https://challenges.cloudflare.com/turnstile/v0/siteverify") do
          [200, {}, { "success" => success, "hostname" => hostname, "error-codes" => error_codes }]
        end
      end
      builder.response :json
    end
  end

  it "succeeds when Turnstile approves the token and the hostname matches the mailer host" do
    result =
      TurnstileVerificationService.new(
        token: "a-token",
        connection: stubbed_connection(success: true, hostname: "intercode.test")
      ).call

    assert result.success?
  end

  it "succeeds when the hostname matches a convention's custom domain" do
    convention = create(:convention, domain: "someconvention.example.com")

    result =
      TurnstileVerificationService.new(
        token: "a-token",
        connection: stubbed_connection(success: true, hostname: convention.domain)
      ).call

    assert result.success?
  end

  it "fails when Turnstile rejects the token" do
    connection = stubbed_connection(success: false, hostname: "intercode.test", error_codes: ["invalid-input-response"])
    result = TurnstileVerificationService.new(token: "a-token", connection: connection).call

    assert result.failure?
  end

  it "fails when Turnstile approves the token but for an unexpected hostname" do
    result =
      TurnstileVerificationService.new(
        token: "a-token",
        connection: stubbed_connection(success: true, hostname: "not-a-real-intercode-domain.example.com")
      ).call

    assert result.failure?
  end

  it "fails without making a request when no token is given" do
    result = TurnstileVerificationService.new(token: nil).call

    assert result.failure?
  end
end
