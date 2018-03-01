class EventsMailer < ApplicationMailer
  helper :form_response

  def event_updated(event, changes)
    @event = event
    @changes = changes
    event_mail(event, 'Update')
  end

  private

  def event_mail_destination(convention)
    staff_position = convention.staff_positions
      .where(name: 'GM Coordinator').first

    if staff_position.email.present?
      staff_position.email
    elsif staff_position
      staff_position.user_con_profiles.map do |user_con_profile|
        "#{user_con_profile.name} <#{user_con_profile.email}>"
      end
    else
      convention.user_con_profiles.where(gm_liaison: true).map do |user_con_profile|
        "#{user_con_profile.name} <#{user_con_profile.email}>"
      end
    end
  end

  def subject_prefix(event)
    "[#{event.convention.name}]"
  end

  def event_url_for_convention(event)
    event_url(event, host: event.convention.domain)
  end
  helper_method :event_url_for_convention

  def event_mail(event, status_change)
    mail(
      from: from_address_for_convention(event.convention),
      to: event_mail_destination(event.convention),
      subject: "#{subject_prefix(event)} #{status_change}: #{event.title}"
    )
  end
end
