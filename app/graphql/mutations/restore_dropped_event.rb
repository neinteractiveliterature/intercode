# frozen_string_literal: true
class Mutations::RestoreDroppedEvent < Mutations::BaseMutation
  field :event, Types::EventType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_convention_associated_model :events, :id, :restore

  def resolve(**_args)
    RestoreDroppedEventService.new(event: event).call!
    { event: event }
  end
end
