class Types::MaximumEventProvidedTicketsOverrideType < Types::BaseObject
  authorize_record

  field :id, Integer, null: false
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
