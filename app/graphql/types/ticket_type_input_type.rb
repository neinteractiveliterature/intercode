Types::TicketTypeInputType = GraphQL::InputObjectType.define do
  name 'TicketTypeInput'

  input_field :name, types.String
  input_field :publicly_available, types.Boolean
  input_field :maximum_event_provided_tickets, types.Int
  input_field :counts_towards_convention_maximum, types.Boolean
  input_field :description, types.String
  input_field :pricing_schedule, Types::ScheduledMoneyValueInputType
end
