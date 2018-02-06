class DropEventService < ApplicationService
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
