# frozen_string_literal: true
class RestoreDroppedEventService < CivilService::Service
  attr_reader :event

  validate :event_must_be_dropped

  def initialize(event:)
    @event = event
  end

  private

  def inner_call
    event.runs.destroy_all
    event.update!(status: 'active')

    success
  end

  def event_must_be_dropped
    return if event.status == 'dropped'
    errors.add :base, "Can only restore dropped events; this event is #{event.status}"
  end
end
