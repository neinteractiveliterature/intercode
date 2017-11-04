Types::TicketType = GraphQL::ObjectType.define do
  name "Ticket"

  field :id, !types.Int
  field :ticket_type, !Types::TicketTypeType
  field :payment_amount, Types::MoneyType
  field :provided_by_event, Types::EventType
end
