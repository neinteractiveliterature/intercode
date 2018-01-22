Mutations::RestoreDroppedEvent = GraphQL::Relay::Mutation.define do
  name "RestoreDroppedEvent"
  return_field :event, Types::EventType

  input_field :id, !types.Int

  resolve ->(_obj, args, ctx) {
    event = ctx[:convention].events.find(args[:id])
    RestoreDroppedEventService.new(event: event).call!
    { event: event }
  }
end
