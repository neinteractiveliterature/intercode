class ReceiveEmailService < CivilService::Service
  def self.ses_client
    @ses_client ||= Aws::SES::Client.new
  end

  attr_reader :recipients, :load_email, :message_id

  def initialize(recipients:, load_email:, message_id: nil)
    @recipients = recipients.map do |recipient|
      case recipient
      when Mail::Address then recipient
      else Mail::Address.new(recipient)
      end
    end.compact
    @load_email = load_email
    @message_id = message_id
  end

  private

  def inner_call
    recipients.each do |recipient|
      forward_addresses = forward_addresses_for_recipient(recipient)

      if forward_addresses
        Rails.logger.debug("Forwarding mail for #{recipient} -> #{forward_addresses.join(', ')}")
        forward_email(recipient, forward_addresses)
      elsif intercode_address?(recipient)
        Rails.logger.warn("Could not find matching route for #{recipient}, sending bounce")
        send_bounce(recipient)
      else
        Rails.logger.debug("#{recipient} is not an Intercode address, ignoring")
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

  def intercode_address?(address)
    intercode_domains.include?(Mail::Address.new(EmailRoute.normalize_address(address)).domain)
  end

  def intercode_domains
    @intercode_domains ||= Set.new([
      *EmailRoute.pluck(:receiver_address).map { |addr| Mail::Address.new(addr).domain },
      *Convention.pluck(:domain, :event_mailing_list_domain).flatten
    ].compact)
  end

  def forward_addresses_for_recipient(recipient)
    address = EmailRoute.normalize_address(recipient)

    staff_positions = staff_positions_for_recipient(address)
    if staff_positions
      return staff_positions.flat_map { |sp| sp.user_con_profiles.map(&:email) + sp.cc_addresses }
    end

    team_members = team_members_for_recipient(address)
    return team_members.flat_map { |tm| tm.user_con_profile.email } if team_members

    route = EmailRoute.find_by(receiver_address: address)
    route&.forward_addresses
  end

  def staff_positions_for_recipient(address)
    convention = Convention.find_by(domain: Mail::Address.new(address).domain)
    return nil unless convention

    if convention.email_mode == 'staff_emails_to_catch_all'
      return [convention.catch_all_staff_position].compact
    end

    matched_positions = convention.staff_positions.includes(user_con_profiles: :user).select do |sp|
      full_email_aliases = sp.email_aliases.map { |ea| "#{ea}@#{convention.domain}" }
      destinations = [sp.email, *full_email_aliases].map do |dest|
        EmailRoute.normalize_address(dest)
      end
      destinations.include?(address)
    end
    return matched_positions if matched_positions.any?

    [convention.catch_all_staff_position].compact
  end

  def team_members_for_recipient(address)
    convention = Convention.find_by(event_mailing_list_domain: Mail::Address.new(address).domain)
    return nil unless convention

    events = convention.events.select do |event|
      next unless event.team_mailing_list_name.present?
      full_alias = "#{event.team_mailing_list_name}@#{convention.event_mailing_list_domain}"
      EmailRoute.normalize_address(full_alias) == address
    end
    TeamMember.where(event_id: events.map(&:id)).includes(user_con_profile: :user).to_a
  end

  def transform_email_for_forwarding(original_recipient, new_recipients)
    from_addresses = email.from.map { |from| EmailRoute.parse_address(from) }.compact

    transformed_from_addresses = from_addresses.map do |address|
      address.display_name = "#{address.display_name || address.address} via #{original_recipient.address}"
      address.address = original_recipient.address
      address
    end

    forward_message = email.dup
    forward_message.reply_to = from_addresses.map(&:to_s)
    forward_message.from = transformed_from_addresses.map(&:to_s)
    forward_message.to = new_recipients
    forward_message.header['X-Intercode-Original-Return-Path'] = forward_message.header['Return-Path']
    forward_message.header['Return-Path'] = "bounces@#{mailer_host}"
    forward_message.header['X-Intercode-Original-Sender'] = forward_message.header['Sender']
    forward_message.header['Sender'] = nil
    forward_message.header['X-Intercode-Original-Source'] = forward_message.header['Source']
    forward_message.header['Source'] = nil
    forward_message.header['DKIM-Signature'] = nil # SES will re-sign the message for us
    forward_message.header['X-SES-CONFIGURATION-SET'] = 'default'
    forward_message.header['X-Intercode-Message-ID'] = message_id

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

  def mailer_host
    Rails.application.config.action_mailer.default_url_options[:host]
  end

  def send_bounce(recipient)
    self.class.ses_client.send_bounce({
      original_message_id: message_id,
      bounce_sender: "Mail Delivery Subsystem <noreply@#{mailer_host}>",
      message_dsn: {
        reporting_mta: "dns; #{mailer_host}",
        arrival_date: Time.zone.now
      },
      bounced_recipient_info_list: [
        {
          recipient: recipient.address,
          bounce_type: 'DoesNotExist'
        }
      ]
    })
  end
end
