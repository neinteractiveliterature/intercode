# frozen_string_literal: true
class DropEventService < CivilService::Service
  attr_reader :event

  def initialize(event:)
    @event = event
  end

  private

  def inner_call
    event.runs.destroy_all
    event.update!(status: 'dropped')

    success
  end
end
