Types::TicketTypeType = GraphQL::ObjectType.define do
  name "TicketType"

  field :id, !types.Int
  field :name, types.String
  field :publicly_available, !types.Boolean
  field :counts_towards_convention_maximum, !types.Boolean
  field :maximum_event_provided_tickets, !types.Int
  field :description, types.String
  field :pricing_schedule, Types::ScheduledMoneyValueType

  field :convention, !Types::ConventionType do
    resolve ->(obj, _args, _ctx) {
      RecordLoader.for(Convention).load(obj.convention_id)
    }
  end
end
