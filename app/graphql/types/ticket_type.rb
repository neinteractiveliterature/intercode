Types::TicketType = GraphQL::ObjectType.define do
  name "Ticket"

  field :id, !types.Int
  field :convention, !Types::ConventionType
  field :user_con_profile, !Types::UserConProfileType
  field :ticket_type, !Types::TicketTypeType
  field :payment_amount, Types::MoneyType
  field :provided_by_event, Types::EventType
end
