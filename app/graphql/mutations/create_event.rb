Mutations::CreateEvent = GraphQL::Relay::Mutation.define do
  name "CreateEvent"
  return_field :event, Types::EventType

  input_field :event, !Types::EventInputType

  resolve ->(_obj, args, ctx) {
    event = ctx[:convention].events.create!(
      args[:event].to_h.merge(
        updated_by: ctx[:user_con_profile].user
      )
    )

    { event: event }
  }
end
