# frozen_string_literal: true
class Events::EventUpdatedNotifier < Notifier
  attr_reader :event, :changes

  condition :event_category do
    { event_category: event.event_category }
  end

  def initialize(event:, changes:)
    @event = event
    @changes = changes
    super(convention: event.convention, event_key: "events/event_updated")
  end

  def liquid_assigns
    super.merge("event" => event, "changes_html" => changes_html)
  end

  def self.build_default_destinations(notification_template:)
    staff_positions =
      notification_template.convention.staff_positions.where(name: ["GM Coordinator", "GM Liaison"]).to_a
    staff_positions ||=
      StaffPosition.where(
        id:
          Permission
            .for_model(notification_template.convention)
            .where(permission: "update_events")
            .select(:staff_position_id)
      )

    staff_positions.map { |staff_position| notification_template.notification_destinations.new(staff_position:) }
  end

  def changes_html
    @changes_html ||= FormResponseChangeGroupPresenter.new(changes, event.convention).html
  end
end
