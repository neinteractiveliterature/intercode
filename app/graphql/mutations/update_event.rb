Mutations::UpdateEvent = GraphQL::Relay::Mutation.define do
  name 'UpdateEvent'
  return_field :event, Types::EventType

  input_field :id, !types.Int
  input_field :event, !Types::EventInputType

  resolve ->(_obj, args, ctx) {
    event = ctx[:convention].events.find(args[:id])
    event.update!(
      args[:event].to_h.merge(
        updated_by: ctx[:user_con_profile].user
      )
    )

    { event: event }
  }
end
