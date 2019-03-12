class Mutations::DropEvent < Mutations::BaseMutation
  field :event, Types::EventType, null: false

  argument :id, Integer, required: true

  def resolve(**args)
    event = convention.events.find(args[:id])
    DropEventService.new(event: event).call!
    { event: event }
  end
end
