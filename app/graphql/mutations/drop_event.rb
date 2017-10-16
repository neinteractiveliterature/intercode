Mutations::DropEvent = GraphQL::Relay::Mutation.define do
  name "DropEvent"
  return_field :event, Types::EventType

  input_field :id, !types.Int

  resolve ->(_obj, args, ctx) {
    event = ctx[:convention].events.find(args[:id])
    DropEventService.new(event: event).call!
    { event: event }
  }
end
