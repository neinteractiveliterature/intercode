Mutations::DeleteMaximumEventProvidedTicketsOverride = GraphQL::Relay::Mutation.define do
  name "DeleteMaximumEventProvidedTicketsOverride"
  return_field :maximum_event_provided_tickets_override, !Types::MaximumEventProvidedTicketsOverrideType

  input_field :id, !types.Int

  resolve ->(_obj, args, _ctx) {
    override = MaximumEventProvidedTicketsOverride.find(args[:id])
    override.destroy!

    { maximum_event_provided_tickets_override: override }
  }
end
