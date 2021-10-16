# frozen_string_literal: true
class Mutations::DropEvent < Mutations::BaseMutation
  field :event, Types::EventType, null: false

  argument :id, Integer, required: true

  load_and_authorize_convention_associated_model :events, :id, :drop

  def resolve(**_args)
    DropEventService.new(event: event).call!
    { event: event }
  end
end
