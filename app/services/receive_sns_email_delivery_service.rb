# frozen_string_literal: true
class ReceiveSnsEmailDeliveryService < CivilService::Service
  def self.aws_region
    ENV.fetch("AWS_EMAIL_RECEIVING_REGION", nil) || ENV.fetch("AWS_REGION")
  end

  attr_reader :message

  def initialize(message:)
    @message = message
  end

  def kms_client
    @kms_client ||= Aws::KMS::Client.new(region: self.class.aws_region)
  end

  def s3_client
    @s3_client ||=
      Aws::S3::EncryptionV2::Client.new(
        kms_key_id: "alias/aws/ses",
        kms_client: kms_client,
        key_wrap_schema: :kms_context,
        content_encryption_schema: :aes_gcm_no_padding,
        security_profile: :v2_and_legacy
      )
  end

  private

  def inner_call
    if failing_score?
      logger.warn("Dropping message #{message_id} because it failed checks: #{score_by_verdict.to_json}")
      return success
    end

    begin
      ReceiveEmailService.new(recipients:, load_email: -> { email }, message_id:).call
    rescue StandardError => e
      ErrorReporting.error(e, recipients:, message_id:)
      raise e
    end
  end

  # Only use the actual recipient of this email according to SES.  If there are multiple recipients
  # that go to Intercode, we get separate SNS notifications for each of them.
  def recipients
    @recipients ||= message["receipt"]["recipients"].map { |recipient| Mail::Address.new(recipient) }
  end

  def message_id
    message["mail"]["messageId"]
  end

  def header(name)
    headers_hash[name.downcase]
  end

  def headers_hash
    @headers_hash ||=
      message["mail"]["headers"].each_with_object({}) { |header, hash| hash[header["name"].downcase] = header["value"] }
  end

  def common_header(name)
    common_headers_hash[name.downcase]
  end

  def common_headers_hash
    message["mail"]["commonHeaders"]
  end

  def receipt_action
    message["receipt"]["action"]
  end

  def verdicts
    @verdicts ||=
      %i[dkim dmarc spam spf virus].each_with_object({}) do |verdict_type, hash|
        verdict_object = message["receipt"]["#{verdict_type}Verdict"]
        hash[verdict_type] = verdict_object ? verdict_object["status"] : "MISSING"
      end
  end

  def score_by_verdict
    @score_by_verdict ||=
      verdicts.each_with_object({}) do |(verdict_type, verdict), hash|
        score =
          if verdict_type == :virus && verdict == "FAIL"
            2
          elsif verdict == "FAIL"
            1
          else
            0
          end

        hash[verdict_type] = score
      end
  end

  def total_score
    @total_score ||= score_by_verdict.values.sum
  end

  def from_addresses
    @from_addresses ||= common_header("From").map { |addr| EmailRoute.normalize_address(addr) }
  end

  def score_threshold
    return 1 unless from_addresses.size == 1
    existing_user = User.find_by(email: from_addresses.first)
    return 1 unless existing_user

    existing_user.tickets.count > 1 ? 2 : 1
  end

  def failing_score?
    total_score >= score_threshold
  end

  def raw_email
    @raw_email ||=
      s3_client.get_object(bucket: receipt_action["bucketName"], key: receipt_action["objectKey"]).body.read
  end

  def email
    @email ||= Mail.read_from_string(raw_email)
  end
end
