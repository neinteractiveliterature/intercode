class ReceiveEmailService < CivilService::Service
  def self.ses_client
    @ses_client ||= Aws::SES::Client.new
  end

  attr_reader :recipients, :load_email

  def initialize(recipients:, load_email:)
    @recipients = recipients.map do |recipient|
      case recipient
      when Mail::Address then recipient
      else Mail::Address.new(recipient)
      end
    end
    @load_email = load_email
  end

  private

  def inner_call
    recipients.each do |recipient|
      forward_addresses = forward_addresses_for_recipient(recipient)

      if forward_addresses
        Rails.logger.debug("Forwarding mail for #{recipient} -> #{forward_addresses.join(', ')}")
        forward_email(recipient, forward_addresses)
      else
        Rails.logger.warn("Could not find matching route for #{recipient}, sending bounce")
        send_bounce(recipient)
      end
    end

    success
  end

  def email
    @email ||= begin
      email = load_email.call
      case email
      when Mail::Message then email
      else Mail.read_from_string(email)
      end
    end
  end

  def forward_addresses_for_recipient(recipient)
    address = EmailRoute.normalize_address(recipient)

    staff_positions = staff_positions_for_recipient(address)
    if staff_positions.any?
      return staff_positions.flat_map { |sp| sp.user_con_profiles.map(&:email) + sp.cc_addresses }
    end

    team_members = team_members_for_recipient(address)
    if team_members.any?
      return team_members.flat_map { |tm| tm.user_con_profile.email }
    end

    route = EmailRoute.find_by(receiver_address: address)
    route&.forward_addresses
  end

  def staff_positions_for_recipient(address)
    convention = Convention.find_by(domain: Mail::Address.new(address).domain)
    return [] unless convention

    convention.staff_positions.includes(user_con_profiles: :user).select do |sp|
      full_email_aliases = sp.email_aliases.map { |ea| "#{ea}@#{convention.domain}" }
      destinations = [sp.email, *sp.email_aliases].map do |dest|
        EmailRoute.normalize_address(dest)
      end
      destinations.include?(address)
    end
  end

  def team_members_for_recipient(address)
    convention = Convention.find_by(event_mailing_list_domain: Mail::Address.new(address).domain)
    return [] unless convention

    events = convention.events.where(team_mailing_list_name: Mail::Address.new(address).local)
    TeamMember.where(event_id: events.select(:id)).includes(user_con_profile: :user).to_a
  end

  def transform_email_for_forwarding(original_recipient, new_recipients)
    from_addresses = email.from.map do |from|
      address = Mail::Address.new(from)
      address.display_name = "#{address.display_name || address.address} via #{original_recipient.address}"
      address.address = original_recipient.address
      address
    end

    forward_message = email.dup
    forward_message.reply_to = email.from
    forward_message.from = from_addresses.map(&:to_s)
    forward_message.to = new_recipients
    forward_message.header['Return-Path'] = nil
    forward_message.header['DKIM-Signature'] = nil
    forward_message.header['X-SES-CONFIGURATION-SET'] = 'default'

    forward_message
  end

  def forward_email(original_recipient, new_recipients)
    forward_message = transform_email_for_forwarding(original_recipient, new_recipients)

    self.class.ses_client.send_raw_email({
      raw_message: {
        data: forward_message.to_s
      }
    })
  end

  def send_bounce(recipient)
    mailer_host = Rails.application.config.action_mailer.default_url_options[:host]

    self.class.ses_client.send_bounce({
      original_message_id: message['mail']['messageId'],
      bounce_sender: "Mail Delivery Subsystem <noreply@#{mailer_host}>",
      message_dsn: {
        reporting_mta: "dns; #{mailer_host}",
        arrival_date: Time.now,
      },
      bounced_recipient_info_list: [
        {
          recipient: recipient.to_s,
          bounce_type: "DoesNotExist"
        },
      ],
    })
  end
end
