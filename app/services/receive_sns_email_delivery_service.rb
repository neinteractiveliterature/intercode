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
    ReceiveEmailService.new(
      recipients: recipients,
      load_email: -> { email }
    ).call
  end

  def recipients
    @recipients ||= Array(common_header('To')).map { |recipient| Mail::Address.new(recipient) }
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
