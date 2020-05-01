class ReceiveSnsEmailDeliveryService < CivilService::Service
  def self.kms_client
    @kms_client ||= Aws::KMS::Client.new
  end

  def self.s3_client
    @s3_client ||= Aws::S3::Encryption::Client.new(
      kms_key_id: 'alias/aws/ses',
      kms_client: kms_client
    )
  end

  def self.ses_client
    @ses_client ||= Aws::SES::Client.new
  end

  attr_reader :message

  def initialize(message:)
    @message = message
  end

  private

  def inner_call
    if failing_score?
      logger.warn(
        "Dropping message #{message_id} because it failed checks: #{score_by_verdict.to_json}"
      )
      return success
    end

    Rollbar.scoped(context: { recipients: recipients, message_id: message_id }) do
      ReceiveEmailService.new(
        recipients: recipients,
        load_email: -> { email },
        message_id: message_id
      ).call
    end
  end

  # Only use the actual recipient of this email according to SES.  If there are multiple recipients
  # that go to Intercode, we get separate SNS notifications for each of them.
  def recipients
    @recipients ||= message['receipt']['recipients'].map do |recipient|
      Mail::Address.new(recipient)
    end
  end

  def message_id
    message['mail']['messageId']
  end

  def header(name)
    headers_hash[name.downcase]
  end

  def headers_hash
    @headers_hash ||= message['mail']['headers'].each_with_object({}) do |header, hash|
      hash[header['name'].downcase] = header['value']
    end
  end

  def common_header(name)
    common_headers_hash[name.downcase]
  end

  def common_headers_hash
    message['mail']['commonHeaders']
  end

  def receipt_action
    message['receipt']['action']
  end

  def verdicts
    @verdicts ||= %i[dkim dmarc spam spf virus].each_with_object({}) do |verdict_type, hash|
      verdict_object = message['receipt']["#{verdict_type}Verdict"]
      hash[verdict_type] = verdict_object ? verdict_object['status'] : 'MISSING'
    end
  end

  def score_by_verdict
    @score_by_verdict ||= verdicts.each_with_object({}) do |(verdict_type, verdict), hash|
      score = case
      when verdict_type == :virus && verdict == 'FAIL' then 2
      when verdict == 'FAIL' then 1
      else 0
      end

      hash[verdict_type] = score
    end
  end

  def total_score
    @total_score ||= score_by_verdict.values.sum
  end

  def failing_score?
    total_score >= 2
  end

  def raw_email
    @raw_email ||= self.class.s3_client.get_object(
      bucket: receipt_action['bucketName'],
      key: receipt_action['objectKey']
    ).body.read
  end

  def email
    @email ||= Mail.read_from_string(raw_email)
  end
end
