Mutations::CreateRun = GraphQL::Relay::Mutation.define do
  name "CreateRun"
  return_field :run, Types::RunType

  input_field :event_id, !types.Int
  input_field :run, !Types::RunInputType

  resolve ->(_obj, args, ctx) {
    event = ctx[:convention].events.find(args[:event_id])

    run = event.runs.create!(
      args[:run].to_h.merge(
        updated_by: ctx[:user_con_profile].user
      )
    )

    { run: run }
  }
end
