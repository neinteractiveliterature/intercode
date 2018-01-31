Mutations::CreateMaximumEventProvidedTicketsOverride = GraphQL::Relay::Mutation.define do
  name "CreateMaximumEventProvidedTicketsOverride"
  return_field :maximum_event_provided_tickets_override, !Types::MaximumEventProvidedTicketsOverrideType

  input_field :event_id, !types.Int
  input_field :ticket_type_id, !types.Int
  input_field :override_value, !types.Int

  resolve ->(_obj, args, ctx) {
    event = ctx[:convention].events.find(args[:event_id])
    override = event.maximum_event_provided_tickets_overrides.create!(
      ticket_type_id: args[:ticket_type_id],
      override_value: args[:override_value]
    )

    { maximum_event_provided_tickets_override: override }
  }
end
