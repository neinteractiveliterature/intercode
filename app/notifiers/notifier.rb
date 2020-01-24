class Notifier
  include ActionView::Helpers::SanitizeHelper

  NOTIFICATIONS_CONFIG = JSON.parse(
    File.read(File.expand_path('config/notifications.json', Rails.root))
  )
  NOTIFIER_CLASSES_BY_EVENT_KEY = NOTIFICATIONS_CONFIG['categories'].flat_map do |category|
    category['events'].map do |event|
      [
        "#{category['key']}/#{event['key']}",
        "#{category['key'].camelize}::#{event['key'].camelize}Notifier".safe_constantize
      ]
    end
  end.to_h

  attr_reader :event_key, :convention

  def initialize(convention:, event_key:)
    @convention = convention
    @event_key = event_key
  end

  def render
    notification_template = convention.notification_templates.find_by!(event_key: event_key)

    use_convention_timezone(convention) do
      {
        subject: notification_template.subject_template,
        body_html: notification_template.body_html_template,
        body_text: notification_template.body_text_template
      }.transform_values do |template|
        cadmus_renderer.render(template, :html, assigns: liquid_assigns)
      end
    end
  end

  def liquid_assigns
    {}
  end

  def destinations
    raise NotImplementedError, 'Notifier subclasses must implement #destinations'
  end

  def deliver_later(options = {})
    mail.deliver_later(options)
    deliver_sms # TODO later
  end

  def deliver_now
    mail.deliver_now
    deliver_sms
  end

  def cadmus_renderer
    @cadmus_renderer ||= CmsRenderingContext.new(
      cms_parent: convention, controller: nil, assigns: { 'convention' => convention }
    ).cadmus_renderer
  end

  # Notifications have to explicitly opt into SMS
  def sends_sms?
    false
  end

  private

  def use_convention_timezone(convention, &block)
    timezone = convention&.timezone

    if timezone
      Time.use_zone(timezone, &block)
    else
      yield
    end
  end

  def deliver_sms
    return unless should_deliver_sms?
    return unless twilio_client && ENV['TWILIO_SMS_DEBUG_DESTINATION'].present?

    to_number = ENV['TWILIO_SMS_DEBUG_DESTINATION']
    twilio_client.messages.create(
      from: ENV['TWILIO_SMS_NUMBER'],
      to: Phonelib.parse(to_number).e164,
      body: sms_content
    )
  end

  def should_deliver_sms?
    return false unless sends_sms?
    return true if ENV['TWILIO_SMS_DEBUG_DESTINATION'].present?

    (convention.starts_at - 24.hours) <= Time.now && (convention.ends_at > Time.now)
  end

  def sms_content
    all_content = render.transform_values(&:presence).compact
    (
      all_content[:sms_text] ||
      all_content[:body_text]&.strip ||
      (all_content[:body_html] && strip_tags(all_content[:body_html]).strip.gsub(/\s+/, ' '))
    )
  end

  def mail
    NotificationsMailer.notification(
      **render.slice(:subject, :body_html, :body_text),
      convention: convention,
      to: emails_for_destinations(destinations)
    )
  end

  def email_for_user_con_profile(user_con_profile)
    address = Mail::Address.new(user_con_profile.email)
    address.display_name = user_con_profile.name
    address.format
  end

  def emails_for_staff_position(staff_position)
    return [staff_position.email] if staff_position.email.present?
    staff_position.user_con_profiles.map { |ucp| email_for_user_con_profile(ucp) }
  end

  def emails_for_destinations(destinations)
    destinations.flat_map do |destination|
      case destination
      when UserConProfile then email_for_user_con_profile(destination)
      when StaffPosition then emails_for_staff_position(destination)
      when nil then []
      else raise InvalidArgument, "Don't know how to send email to a #{destination.class}"
      end
    end
  end

  def twilio_client
    return unless ENV['TWILIO_ACCOUNT_SID'].present? && ENV['TWILIO_AUTH_TOKEN'].present?

    @twilio_client ||= Twilio::REST::Client.new ENV['TWILIO_ACCOUNT_SID'], ENV['TWILIO_AUTH_TOKEN']
  end
end
