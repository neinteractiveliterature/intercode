# frozen_string_literal: true
class Mutations::RestoreDroppedEvent < Mutations::BaseMutation
  field :event, Types::EventType, null: false

  argument :id, ID, required: false

  load_and_authorize_convention_associated_model :events, :id, :restore

  def resolve(**_args)
    RestoreDroppedEventService.new(event: event).call!
    { event: event }
  end
end
