Mutations::CreateRun = GraphQL::Relay::Mutation.define do
  name "CreateRun"
  return_field :run, Types::RunType

  input_field :event_id, !types.Int
  input_field :starts_at, !Types::DateType
  input_field :title_suffix, types.String
  input_field :schedule_note, types.String
  input_field :room_ids, types[types.Int]

  resolve ->(_obj, args, ctx) {
    event = ctx[:convention].events.find(args[:event_id])

    run = event.runs.create!(
      starts_at: args[:starts_at],
      title_suffix: args[:title_suffix],
      schedule_note: args[:schedule_note],
      room_ids: args[:room_ids],
      updated_by: ctx[:user_con_profile].user,
    )

    { run: run }
  }
end
