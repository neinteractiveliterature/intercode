Mutations::DeleteEvent = GraphQL::Relay::Mutation.define do
  name "DeleteEvent"
  return_field :event, Types::EventType

  input_field :id, !types.Int

  resolve ->(_obj, args, ctx) {
    event = ctx[:convention].events.find(args[:id])
    event.destroy!
    { event: event }
  }
end
