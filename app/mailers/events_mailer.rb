class EventsMailer < ApplicationMailer
  def event_updated(event, changes)
    @event = event
    @changes = changes

    use_convention_timezone(@event.convention) do
      event_mail(event, 'Update')
    end
  end

  private

  def event_mail_destination(convention)
    staff_positions = convention.staff_positions
      .where(name: ['GM Coordinator', 'GM Liaison']).to_a
    staff_positions ||= StaffPosition.where(
      id: Permission.for_model(convention).where(permission: 'update_events')
        .select(:staff_position_id)
    )

    emails_for_staff_positions(staff_positions)
  end

  def subject_prefix(event)
    "[#{event.convention.name}]"
  end

  def event_url_for_convention(event)
    url_with_convention_host("/events/#{event.to_param}", event.convention)
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
