class NotifyEventChangesJob < ApplicationJob
  def perform
    NotifyFormResponseChangesService.new(
      scope: FormResponseChange.where(response_type: 'Event'),
      send_mail: -> (event_id, compacted_changes) do
        event = Event.find(event_id)
        EventsMailer.event_updated(event, compacted_changes).deliver_now
      end
    ).call!
  end
end
