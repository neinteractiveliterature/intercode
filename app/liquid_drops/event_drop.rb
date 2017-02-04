class EventDrop < Liquid::Drop
  attr_reader :event
  delegate :title, to: :event

  def initialize(event)
    @event = event
  end
end