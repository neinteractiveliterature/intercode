# frozen_string_literal: true
require "test_helper"

class SendNotificationJobTest < ActiveJob::TestCase
  class FailingNotifier
    class << self
      attr_accessor :error
    end

    def initialize(**_options)
    end

    def deliver_now
      raise self.class.error
    end
  end

  def perform_with_error(error)
    FailingNotifier.error = error
    Notifier.stub(:notifier_class_for_event_key, FailingNotifier) do
      SendNotificationJob.perform_now(event_key: "signups/signup_confirmation", options: {})
    end
  end

  it "retries when SES v2 reports that the sending rate was exceeded" do
    error = Aws::SESV2::Errors::TooManyRequestsException.new(nil, "Maximum sending rate exceeded.")

    assert_enqueued_with(job: SendNotificationJob) { perform_with_error(error) }
  end

  it "retries when SES v1 reports throttling" do
    error = Aws::SES::Errors::Throttling.new(nil, "Throttling")

    assert_enqueued_with(job: SendNotificationJob) { perform_with_error(error) }
  end

  it "does not swallow unrelated errors" do
    assert_raises(ArgumentError) { perform_with_error(ArgumentError.new("nope")) }
    assert_no_enqueued_jobs
  end
end
