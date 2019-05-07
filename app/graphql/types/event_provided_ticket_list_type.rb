class Types::EventProvidedTicketListType < Types::BaseObject
  field :provided_by_event, Types::EventType, null: false
  field :tickets, [Types::TicketType], null: false
end
