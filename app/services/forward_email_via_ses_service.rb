# frozen_string_literal: true
class ForwardEmailViaSesService < CivilService::Service
  def self.ses_client
    @ses_client ||= Aws::SES::Client.new
  end

  attr_reader :recipients, :load_email, :message_id

  def initialize(recipients:, load_email:, message_id: nil)
    @recipients =
      recipients.filter_map do |recipient|
        case recipient
        when Mail::Address
          recipient
        else
          Mail::Address.new(recipient)
        end
      end
    @load_email = load_email
    @message_id = message_id
  end

  private

  def inner_call
    recipients.each do |recipient|
      forward_addresses = forward_addresses_for_recipient(recipient)

      if forward_addresses
        Rails.logger.debug { "Forwarding mail for #{recipient} -> #{forward_addresses.join(", ")}" }
        forward_email(recipient, forward_addresses)
      elsif intercode_address?(recipient)
        Rails.logger.warn("Could not find matching route for #{recipient}, sending bounce")
        send_bounce(recipient)
      else
        Rails.logger.debug { "#{recipient} is not an Intercode address, ignoring" }
      end
    end

    success
  end

  def email
    @email ||=
      begin
        email = load_email.call
        case email
        when Mail::Message
          email
        else
          Mail.read_from_string(email)
        end
      end
  end

  def intercode_address?(address)
    intercode_domains.include?(Mail::Address.new(EmailRoute.normalize_address(address)).domain)
  end

  def intercode_domains
    @intercode_domains ||=
      Set.new(
        [
          *EmailRoute.pluck(:receiver_address).map { |addr| Mail::Address.new(addr).domain },
          *Convention.pluck(:domain, :event_mailing_list_domain).flatten
        ].compact
      )
  end

  def forward_addresses_for_recipient(recipient)
    EmailForwardingRouter.new(recipient).forward_addresses
  end

  def headers_for_forwarding(forward_message)
    {
      "X-Intercode-Original-Return-Path" => forward_message.header["Return-Path"],
      "Return-Path" => "bounces@#{mailer_host}",
      "X-Intercode-Original-Sender" => forward_message.header["Sender"],
      "Sender" => nil,
      "X-Intercode-Original-Source" => forward_message.header["Source"],
      "Source" => nil,
      "DKIM-Signature" => nil, # SES will re-sign the message for us
      "X-SES-CONFIGURATION-SET" => "default",
      "X-Intercode-Message-ID" => message_id
    }
  end

  def from_addresses_for_forwarding(original_recipient)
    from_addresses = email.from.filter_map { |from| EmailRoute.parse_address(from) }
    from_addresses.map do |from_address|
      address = from_address.dup
      display_name = address.display_name || address.address
      address.display_name = "#{display_name} via #{original_recipient.address}"
      address.address = original_recipient.address
      address
    end
  end

  def transform_email_for_forwarding(original_recipient, new_recipients)
    transformed_from_addresses = from_addresses_for_forwarding(original_recipient)
    if transformed_from_addresses.empty?
      Rails.logger.warn(
        "Dropping message #{message_id} because it has no parseable From: addresses.  Original \
header: #{email.from}"
      )
      return nil
    end

    forward_message = email.dup
    forward_message.reply_to = email.from
    forward_message.from = transformed_from_addresses.map(&:to_s)
    forward_message.to = new_recipients
    forward_message.cc = nil
    forward_message.bcc = nil
    headers_for_forwarding(forward_message).each { |key, value| forward_message.header[key] = value }

    forward_message
  end

  def forward_email(original_recipient, new_recipients)
    forward_message = transform_email_for_forwarding(original_recipient, new_recipients)
    return unless forward_message

    begin
      self.class.ses_client.send_raw_email({ raw_message: { data: forward_message.to_s } })
    rescue Aws::SES::Errors::InvalidParameterValue => e
      if e.message.include?("Message length is more")
        send_bounce(original_recipient, bounce_type: "MessageTooLarge")
      else
        send_bounce(original_recipient)
      end
    end
  end

  def mailer_host
    Rails.application.config.action_mailer.default_url_options[:host]
  end

  def send_bounce(recipient, bounce_type: "DoesNotExist")
    self.class.ses_client.send_bounce(
      {
        original_message_id: message_id,
        bounce_sender: "Mail Delivery Subsystem <noreply@#{mailer_host}>",
        message_dsn: {
          reporting_mta: "dns; #{mailer_host}",
          arrival_date: Time.zone.now
        },
        bounced_recipient_info_list: [{ recipient: recipient.address, bounce_type: bounce_type }]
      }
    )
  end
end
