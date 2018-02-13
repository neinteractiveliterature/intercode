Types::TicketType = GraphQL::ObjectType.define do
  name 'Ticket'

  field :id, !types.Int
  field :convention, !Types::ConventionType
  field :user_con_profile, !Types::UserConProfileType
  field :ticket_type, !Types::TicketTypeType do
    resolve -> (obj, _args, _ctx) {
      RecordLoader.for(TicketType).load(obj.ticket_type_id)
    }
  end
  field :payment_amount, Types::MoneyType do
    guard -> (ticket, _args, ctx) do
      ctx[:current_ability].can?(:update, ticket)
    end
  end
  field :provided_by_event, Types::EventType do
    resolve -> (obj, _args, _ctx) {
      RecordLoader.for(Event).load(obj.provided_by_event_id)
    }
  end
end
