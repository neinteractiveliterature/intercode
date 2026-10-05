# frozen_string_literal: true
require "test_helper"

class ReceiveSnsEmailDeliveryServiceTest < ActiveSupport::TestCase
  let(:raw_email) { "From: alice@gmail.com\r\nTo: staff@example.com\r\nSubject: Hello\r\n\r\nBody" }

  # What SES sends SNS for a received message, with every check passing unless told otherwise
  def build_message(verdicts: {}, from: ["alice@gmail.com"], recipients: ["staff@example.com"])
    verdict_statuses = { dkim: "PASS", dmarc: "PASS", spam: "PASS", spf: "PASS", virus: "PASS" }.merge(verdicts)
    receipt = {
      "recipients" => recipients,
      "action" => {
        "bucketName" => "mail-bucket",
        "objectKey" => "inbound/ses-message-1"
      }
    }
    # (a nil status leaves the verdict out of the receipt entirely)
    verdict_statuses.each { |type, status| receipt["#{type}Verdict"] = { "status" => status } if status }

    {
      "notificationType" => "Received",
      "mail" => {
        "messageId" => "ses-message-1",
        "headers" => [{ "name" => "From", "value" => "alice@gmail.com" }],
        "commonHeaders" => {
          "from" => from
        }
      },
      "receipt" => receipt
    }
  end

  # Stands in for S3, and records which object was asked for
  FakeS3Client =
    Struct.new(:raw_email, :requests) do
      def get_object(**params)
        requests << params
        Struct.new(:body).new(StringIO.new(raw_email))
      end
    end

  # Runs the service with the forwarding service and S3 replaced, returning what the forwarding service was given
  def receive(message, forward_result: nil, load_email: false)
    forwards = []
    loaded_emails = []
    s3_client = FakeS3Client.new(raw_email, [])
    fake_forward =
      lambda do |**kwargs|
        forwards << kwargs
        # (the stubs only last for this call, so an email that's wanted has to be loaded while the forwarder runs)
        loaded_emails << kwargs[:load_email].call if load_email
        Struct.new(:result) { def call = result }.new(forward_result || CivilService::Result.success)
      end

    service = ReceiveSnsEmailDeliveryService.new(message:)
    result =
      ForwardEmailViaSesService.stub(:new, fake_forward) do
        service.stub(:s3_client, s3_client) { yield_result(service) }
      end
    { result:, forwards:, loaded_emails:, s3_requests: s3_client.requests }
  end

  def yield_result(service)
    service.call
  end

  describe "a message that passes every check" do
    it "forwards it to the recipients SES says it was for, with its message id" do
      outcome = receive(build_message(recipients: %w[staff@example.com help@example.com]))

      assert outcome[:result].success?
      assert_equal 1, outcome[:forwards].size
      forward = outcome[:forwards].first
      assert_equal %w[staff@example.com help@example.com], forward[:recipients].map(&:address)
      assert_equal "ses-message-1", forward[:message_id]
    end

    it "doesn't read the email from S3 unless the forwarder asks for it" do
      outcome = receive(build_message)

      assert_empty outcome[:s3_requests]
    end

    it "reads the email from the S3 object named in the receipt" do
      outcome = receive(build_message, load_email: true)

      assert_equal ["Hello"], outcome[:loaded_emails].map(&:subject)
      assert_equal [{ bucket: "mail-bucket", key: "inbound/ses-message-1" }], outcome[:s3_requests]
    end
  end

  describe "spam and other failed checks" do
    it "drops a message that fails a check, without forwarding it, and counts that as a success" do
      outcome = receive(build_message(verdicts: { spf: "FAIL" }))

      assert outcome[:result].success?
      assert_empty outcome[:forwards]
    end

    it "drops a message flagged as a virus" do
      outcome = receive(build_message(verdicts: { virus: "FAIL" }))

      assert_empty outcome[:forwards]
    end

    it "lets a message through when a check was inconclusive rather than failed" do
      outcome = receive(build_message(verdicts: { dkim: "GRAY", spam: "PROCESSING_FAILED" }))

      assert_equal 1, outcome[:forwards].size
    end

    it "treats a verdict that is missing from the receipt as not failed" do
      outcome = receive(build_message(verdicts: { dmarc: nil }))

      assert_equal 1, outcome[:forwards].size
    end

    it "drops a message when several checks fail" do
      outcome = receive(build_message(verdicts: { spf: "FAIL", dkim: "FAIL" }))

      assert_empty outcome[:forwards]
    end

    it "drops a message from several From addresses that fails a check" do
      outcome = receive(build_message(verdicts: { spf: "FAIL" }, from: %w[a@gmail.com b@gmail.com]))

      assert_empty outcome[:forwards]
    end
  end

  describe "senders we know" do
    it "still drops a failing message from an address with no account" do
      outcome = receive(build_message(verdicts: { spf: "FAIL" }, from: ["stranger@gmail.com"]))

      assert_empty outcome[:forwards]
    end

    it "still drops a failing message from a user who has at most one ticket" do
      user = create(:user, email: "alice@gmail.com")
      create(:ticket, user_con_profile: create(:user_con_profile, user:))

      outcome = receive(build_message(verdicts: { spf: "FAIL" }))

      assert_empty outcome[:forwards]
    end

    it "gives a returning attendee (more than one ticket) the benefit of the doubt on one failed check" do
      user = create(:user, email: "alice@gmail.com")
      2.times { create(:ticket, user_con_profile: create(:user_con_profile, user:)) }

      outcome = receive(build_message(verdicts: { spf: "FAIL" }))

      assert_equal 1, outcome[:forwards].size
    end

    it "but not for a virus, which counts double" do
      user = create(:user, email: "alice@gmail.com")
      2.times { create(:ticket, user_con_profile: create(:user_con_profile, user:)) }

      outcome = receive(build_message(verdicts: { virus: "FAIL" }))

      assert_empty outcome[:forwards]
    end
  end

  describe "when forwarding fails" do
    it "passes the failure on, so the job fails and can be retried" do
      failure =
        CivilService::Result.failure(
          errors: ActiveModel::Errors.new(Object.new),
          exception: RuntimeError.new("SES down")
        )

      outcome = receive(build_message, forward_result: failure)

      assert outcome[:result].failure?
    end
  end

  describe "the AWS region" do
    setup { @original_regions = ENV.to_h.slice("AWS_EMAIL_RECEIVING_REGION", "AWS_REGION") }

    teardown do
      %w[AWS_EMAIL_RECEIVING_REGION AWS_REGION].each do |key|
        @original_regions.key?(key) ? ENV[key] = @original_regions[key] : ENV.delete(key)
      end
    end

    it "uses the email receiving region when there is one" do
      ENV["AWS_EMAIL_RECEIVING_REGION"] = "us-west-2"
      ENV["AWS_REGION"] = "us-east-1"

      assert_equal "us-west-2", ReceiveSnsEmailDeliveryService.aws_region
    end

    it "falls back to the general AWS region" do
      ENV.delete("AWS_EMAIL_RECEIVING_REGION")
      ENV["AWS_REGION"] = "us-east-1"

      assert_equal "us-east-1", ReceiveSnsEmailDeliveryService.aws_region
    end
  end
end
