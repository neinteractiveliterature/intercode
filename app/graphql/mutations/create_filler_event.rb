Mutations::CreateFillerEvent = GraphQL::Relay::Mutation.define do
  name 'CreateFillerEvent'
  return_field :event, Types::EventType

  input_field :event, !Types::EventInputType
  input_field :run, !Types::RunInputType

  resolve ->(_obj, args, ctx) {
    event = ctx[:convention].events.new(
      args[:event].to_h.merge(
        category: 'filler',
        updated_by: ctx[:user_con_profile].user
      )
    )

    event.runs.new(
      args[:run].to_h.merge(
        updated_by: ctx[:user_con_profile].user
      )
    )

    event.save!

    { event: event }
  }
end
