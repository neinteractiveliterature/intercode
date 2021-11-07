# frozen_string_literal: true
class Types::MaximumEventProvidedTicketsOverrideType < Types::BaseObject
  authorize_record

  field :transitional_id,
        ID,
        deprecation_reason:
          "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
        null: false,
        method: :id,
        camelize: true
  field :id, ID, null: false
  field :event, Types::EventType, null: false

  def event
    AssociationLoader.for(MaximumEventProvidedTicketsOverride, :event).load(object)
  end

  field :ticket_type, Types::TicketTypeType, null: false

  def ticket_type
    AssociationLoader.for(MaximumEventProvidedTicketsOverride, :ticket_type).load(object)
  end

  field :override_value, Integer, null: false
end
