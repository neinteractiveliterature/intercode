# frozen_string_literal: true
require "test_helper"

class SnsNotificationsControllerTest < ActionDispatch::IntegrationTest
  include ActiveJob::TestHelper

  # Stands in for Aws::SNS::MessageVerifier, which would check the message's signature against AWS's certificate
  FakeVerifier = Struct.new(:authentic) { def authentic?(_raw_post) = authentic }

  # Stands in for the SNS client, recording subscription confirmations (or failing them)
  class FakeSnsClient
    attr_reader :confirmations

    def initialize(error: nil)
      @error = error
      @confirmations = []
    end

    def confirm_subscription(**params)
      raise @error if @error
      @confirmations << params
    end
  end

  let(:received_message) do
    {
      "notificationType" => "Received",
      "mail" => {
        "messageId" => "ses-message-1"
      },
      "receipt" => {
        "recipients" => ["staff@example.com"]
      }
    }
  end

  # SNS posts JSON with a text/plain content type
  def post_sns(payload, authentic: true, sns_client: FakeSnsClient.new)
    Aws::SNS::MessageVerifier.stub(:new, FakeVerifier.new(authentic)) do
      SnsNotificationsController.stub(:sns_client, sns_client) do
        post "/sns_notifications",
             params: payload.is_a?(String) ? payload : payload.to_json,
             headers: {
               "Content-Type" => "text/plain; charset=UTF-8"
             }
      end
    end
  end

  def notification(message)
    { "Type" => "Notification", "MessageId" => "sns-1", "Message" => message.to_json }
  end

  describe "authenticity" do
    it "rejects a request whose signature doesn't verify, without acting on it" do
      assert_no_enqueued_jobs { post_sns(notification(received_message), authentic: false) }

      assert_response :unauthorized
    end

    it "rejects a request with no body" do
      post_sns("")

      assert_response :unauthorized
    end

    it "doesn't confirm subscriptions for requests that aren't authentic" do
      client = FakeSnsClient.new
      post_sns(
        { "Type" => "SubscriptionConfirmation", "TopicArn" => "arn:topic", "Token" => "t" },
        authentic: false,
        sns_client: client
      )

      assert_response :unauthorized
      assert_empty client.confirmations
    end
  end

  describe "a subscription confirmation" do
    let(:payload) do
      { "Type" => "SubscriptionConfirmation", "TopicArn" => "arn:aws:sns:us-east-1:1:topic", "Token" => "tok" }
    end

    it "confirms the subscription with the topic and token" do
      client = FakeSnsClient.new

      post_sns(payload, sns_client: client)

      assert_response :ok
      assert_equal [{ topic_arn: "arn:aws:sns:us-east-1:1:topic", token: "tok" }], client.confirmations
    end

    it "responds with a bad request, and reports the error, if AWS won't confirm it" do
      reported = []
      client = FakeSnsClient.new(error: Aws::SNS::Errors::InvalidParameter.new(nil, "bad token"))

      ErrorReporting.stub(:error, ->(error, **) { reported << error }) { post_sns(payload, sns_client: client) }

      assert_response :bad_request
      assert_equal 1, reported.size
      assert_kind_of Aws::SNS::Errors::InvalidParameter, reported.first
    end
  end

  describe "a notification" do
    it "queues the received email for processing" do
      assert_enqueued_with(job: ReceiveSnsEmailDeliveryJob, args: [received_message]) do
        post_sns(notification(received_message))
      end

      assert_response :ok
    end

    it "reports, but otherwise ignores, a notification type we don't handle" do
      reported = []
      bounce = { "notificationType" => "Bounce" }

      assert_no_enqueued_jobs do
        ErrorReporting.stub(:warn, ->(message, **extra) { reported << [message, extra] }) do
          post_sns(notification(bounce))
        end
      end

      assert_response :ok
      assert_equal "Unhandled SNS notificationType: Bounce", reported.first.first
      assert_equal bounce, reported.first.last[:message]
    end
  end

  describe "any other kind of SNS message" do
    it "does nothing and responds with no content" do
      assert_no_enqueued_jobs { post_sns({ "Type" => "UnsubscribeConfirmation" }) }

      assert_response :no_content
    end
  end
end
