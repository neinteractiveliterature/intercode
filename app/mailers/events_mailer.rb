class EventsMailer < ApplicationMailer
  def event_updated(event, changes)
    changes_html = FormResponseChangeGroupPresenter.new(changes, event.convention).html

    notification_template_mail(
      event.convention,
      'events/event_updated',
      { 'event' => event, 'changes_html' => changes_html },
      from: from_address_for_convention(event.convention),
      to: event_mail_destination(event.convention)
    )
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
end
