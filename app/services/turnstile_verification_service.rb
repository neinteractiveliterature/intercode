# frozen_string_literal: true
class TurnstileVerificationService < CivilService::Service
  SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

  validates :token, presence: true

  attr_reader :token, :remote_ip

  def initialize(token:, remote_ip: nil, connection: nil)
    super()
    @token = token
    @remote_ip = remote_ip
    @connection = connection
  end

  private

  def inner_call
    response = connection.post(SITEVERIFY_URL, verify_params)
    body = response.body

    unless body["success"]
      errors.add :base, "Turnstile verification failed: #{Array(body["error-codes"]).join(", ")}"
      return failure(errors)
    end

    unless hostname_allowed?(body["hostname"])
      errors.add :base, "Turnstile verification succeeded for an unexpected hostname: #{body["hostname"]}"
      return failure(errors)
    end

    success
  end

  def verify_params
    { secret: ENV.fetch("TURNSTILE_SECRET_KEY"), response: token, remoteip: remote_ip }.compact
  end

  def hostname_allowed?(hostname)
    Rails.application.config.action_mailer.default_url_options[:host].to_s.gsub(/:\d+\z/, "") == hostname ||
      Convention.where(domain: hostname).any?
  end

  def connection
    @connection ||=
      Faraday.new do |builder|
        builder.request :url_encoded
        builder.response :json
        builder.response :raise_error
      end
  end
end
