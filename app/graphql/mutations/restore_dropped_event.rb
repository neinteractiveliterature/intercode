class Mutations::RestoreDroppedEvent < Mutations::BaseMutation
  field :event, Types::EventType, null: false

  argument :id, Integer, required: true

  load_and_authorize_convention_associated_model :events, :id, :restore

  def resolve(**args)
    RestoreDroppedEventService.new(event: event).call!
    { event: event }
  end
end
