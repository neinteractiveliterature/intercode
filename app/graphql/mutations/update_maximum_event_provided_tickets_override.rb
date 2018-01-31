Mutations::UpdateMaximumEventProvidedTicketsOverride = GraphQL::Relay::Mutation.define do
  name "UpdateMaximumEventProvidedTicketsOverride"
  return_field :maximum_event_provided_tickets_override, !Types::MaximumEventProvidedTicketsOverrideType

  input_field :id, !types.Int
  input_field :override_value, !types.Int

  resolve ->(_obj, args, ctx) {
    override = MaximumEventProvidedTicketsOverride.find(args[:id])
    override.update!(override_value: args[:override_value])

    { maximum_event_provided_tickets_override: override }
  }
end
