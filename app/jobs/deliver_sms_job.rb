class DeliverSmsJob < ApplicationJob
  def perform(user_con_profile, content, debug)
    return unless twilio_client

    destination = sms_destination(user_con_profile, debug)
    return unless destination

    actual_content = if debug
      "DEBUG: Message to #{user_con_profile.name_without_nickname}\n\n#{content}"
    else
      content
    end

    twilio_client.messages.create(
      from: ENV['TWILIO_SMS_NUMBER'],
      to: Phonelib.parse(destination).e164,
      body: actual_content
    )
  end

  def sms_destination(user_con_profile, debug)
    if debug
      ENV['TWILIO_SMS_DEBUG_DESTINATION'].presence
    else
      return nil unless user_con_profile&.allow_sms?
      user_con_profile.mobile_phone.presence
    end
  end

  def twilio_client
    return unless ENV['TWILIO_ACCOUNT_SID'].present? && ENV['TWILIO_AUTH_TOKEN'].present?

    @twilio_client ||= begin
      Twilio::REST::Client.new ENV['TWILIO_ACCOUNT_SID'], ENV['TWILIO_AUTH_TOKEN']
    end
  end
end
