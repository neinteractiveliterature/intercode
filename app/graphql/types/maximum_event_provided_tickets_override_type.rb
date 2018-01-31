Types::MaximumEventProvidedTicketsOverrideType = GraphQL::ObjectType.define do
  name "MaximumEventProvidedTicketsOverride"

  field :id, !types.Int

  field :event, !Types::EventType do
    resolve -> (obj, _args, _ctx) {
      AssociationLoader.for(MaximumEventProvidedTicketsOverride, :event).load(obj)
    }
  end

  field :ticket_type, !Types::TicketTypeType do
    resolve -> (obj, _args, _ctx) {
      AssociationLoader.for(MaximumEventProvidedTicketsOverride, :ticket_type).load(obj)
    }
  end

  field :override_value, !types.Int
end
