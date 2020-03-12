class SnsNotificationsController < ApplicationController
  skip_forgery_protection
  before_action :verify_request_authenticity

  def self.sns_client
    @sns_client ||= Aws::SNS::Client.new
  end

  def create
    case message_body['Type']
    when 'SubscriptionConfirmation'
      confirm_subscription ? (head :ok) : (head :bad_request)
    when 'Notification'
      message = JSON.parse(message_body['Message'])
      handle_message(message)
      head :ok
    end
  end

  private

  def handle_message
    case message['notificationType']
    when 'Received'
      ReceiveEmailService.new(message: message).call!
    else
      warning_message = "Unhandled SNS notificationType: #{message['notificationType']}"
      Rails.logger.warn(warning_message)
      Rollbar.warn(warning_message, message: message)
    end
  end

  def verify_request_authenticity
    head :unauthorized if raw_post.blank? || !message_verifier.authentic?(raw_post)
  end

  def raw_post
    @raw_post ||= request.raw_post
  end

  def message_body
    @message_body ||= JSON.parse(raw_post)
  end

  def message_verifier
    @message_verifier ||= Aws::SNS::MessageVerifier.new
  end

  def confirm_subscription
    SnsNotificationsController.sns_client.confirm_subscription(
      topic_arn: message_body['TopicArn'],
      token: message_body['Token']
    )
    true
  rescue Aws::SNS::Errors::ServiceError => e
    Rails.logger.error(e.message)
    Rollbar.error(e)
    false
  end
end
