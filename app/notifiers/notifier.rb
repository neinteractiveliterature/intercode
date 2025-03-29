# frozen_string_literal: true
class Notifier
  include ActionView::Helpers::SanitizeHelper
  include Notifier::Dsl

  NOTIFICATIONS_CONFIG = JSON.parse(File.read(File.expand_path("config/notifications.json", Rails.root)))
  NOTIFIER_CLASSES_BY_EVENT_KEY =
    NOTIFICATIONS_CONFIG["categories"]
      .flat_map do |category|
        category["events"].map do |event|
          [
            "#{category["key"]}/#{event["key"]}",
            "#{category["key"].camelize}::#{event["key"].camelize}Notifier".safe_constantize
          ]
        end
      end
      .to_h

  def self.current_timezone
    Thread.current["notifier_timezone"]
  end

  def self.use_timezone(timezone)
    Thread.current["notifier_timezone"] = timezone
    yield
  ensure
    Thread.current["notifier_timezone"] = nil
  end

  def self.notifier_class_for_event_key(event_key)
    Notifier::NOTIFIER_CLASSES_BY_EVENT_KEY.fetch(event_key)
  end

  def self.inherited(subclass)
    subclass.instance_eval { include Notifier::Dsl }
  end

  attr_reader :event_key, :convention, :triggering_user

  def initialize(convention:, event_key:, triggering_user: nil)
    @convention = convention
    @event_key = event_key
    @triggering_user = triggering_user
  end

  def render
    Time.use_zone(Notifier.current_timezone) do
      {
        subject: notification_template.subject_template,
        body_html: notification_template.body_html_template,
        body_text: notification_template.body_text_template,
        body_sms: notification_template.body_sms_template
      }.transform_values { |template| cadmus_renderer.render(template, :html, assigns: liquid_assigns) }
    end
  end

  def notification_template
    @notification_template = convention.notification_templates.find_by!(event_key: event_key)
  end

  def destinations
    notification_template.notification_destinations
  end

  def destination_emails
    destinations.flat_map { |destination| destination.emails(self) }.uniq
  end

  def destination_user_con_profiles
    destinations.flat_map { |destination| destination.user_con_profiles(self) }.uniq
  end

  def liquid_assigns
    {}
  end

  def self.build_default_destinations(notification_template:)
    raise NotImplementedError, "Notifier subclasses must implement .build_default_destinations"
  end

  def deliver_later(options = {})
    mail.deliver_later(options)
    sms_jobs.each { |job| job.enqueue(options) }
  end

  def deliver_now
    mail.deliver_now
    sms_jobs.each(&:perform_now)
  end

  def deliver_preview(user_con_profile:, email: false, sms: false)
    mail(preview_user_con_profile: user_con_profile).deliver_now if email
    sms_jobs(preview_user_con_profile: user_con_profile).each(&:perform_now) if sms
  end

  def cadmus_renderer
    @cadmus_renderer ||=
      CmsRenderingContext.new(
        cms_parent: convention,
        controller: nil,
        timezone: Notifier.current_timezone,
        assigns: {
          "convention" => convention
        }
      ).cadmus_renderer
  end

  # Notifications have to explicitly opt into SMS
  def sends_sms?
    false
  end

  private

  def sms_jobs(preview_user_con_profile: nil)
    return [] unless should_deliver_sms? || preview_user_con_profile

    content = sms_content

    user_con_profiles = preview_user_con_profile ? [preview_user_con_profile] : destination_user_con_profiles

    user_con_profiles.filter_map do |user_con_profile|
      next nil unless user_con_profile.allow_sms?
      DeliverSmsJob.new(user_con_profile, content, ENV["TWILIO_SMS_DEBUG_DESTINATION"].present?)
    end
  end

  def should_deliver_sms?
    return false unless sends_sms?
    return true if ENV["TWILIO_SMS_DEBUG_DESTINATION"].present?
    return false unless convention.starts_at && convention.ends_at

    (convention.starts_at - 24.hours) <= Time.zone.now && (convention.ends_at > Time.zone.now)
  end

  def sms_content
    all_content = render.transform_values(&:presence).compact

    all_content[:body_sms] || all_content[:body_text]&.strip ||
      (all_content[:body_html] && strip_tags(all_content[:body_html]).strip.gsub(/\s+/, " "))
  end

  def mail(preview_user_con_profile: nil)
    NotificationsMailer.notification(
      **render.slice(:subject, :body_html, :body_text),
      convention: convention,
      to: (preview_user_con_profile ? email_for_user_con_profile(preview_user_con_profile) : destination_emails)
    )
  end
end
