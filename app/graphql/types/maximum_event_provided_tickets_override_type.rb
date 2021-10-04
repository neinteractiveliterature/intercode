# frozen_string_literal: true
class Types::MaximumEventProvidedTicketsOverrideType < Types::BaseObject
  authorize_record

  field :id,
        Integer,
        deprecation_reason:
          'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
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
