Mutations::UpdateRun = GraphQL::Relay::Mutation.define do
  name "UpdateRun"
  return_field :run, Types::RunType

  input_field :id, !types.Int
  input_field :starts_at, !Types::DateType
  input_field :title_suffix, types.String
  input_field :schedule_note, types.String
  input_field :room_ids, types[types.Int]

  resolve ->(_obj, args, ctx) {
    run = ctx[:convention].runs.find(args[:id])

    run.update!(
      starts_at: args[:starts_at],
      title_suffix: args[:title_suffix],
      schedule_note: args[:schedule_note],
      room_ids: args[:room_ids],
      updated_by: ctx[:user_con_profile].user
    )

    { run: run }
  }
end
