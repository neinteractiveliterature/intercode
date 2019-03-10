Mutations::CreateMultipleRuns = GraphQL::Relay::Mutation.define do
  name 'CreateMultipleRuns'
  return_field :runs, Types::RunType.to_non_null_type.to_list_type.to_non_null_type

  input_field :event_id, !types.Int
  input_field :runs, Types::RunInputType.to_non_null_type.to_list_type.to_non_null_type

  resolve ->(_obj, args, ctx) {
    event = ctx[:convention].events.find(args[:event_id])

    runs = args[:runs].map do |run|
      event.runs.create!(
        starts_at: run[:starts_at],
        title_suffix: run[:title_suffix],
        schedule_note: run[:schedule_note],
        room_ids: run[:room_ids],
        updated_by: ctx[:user_con_profile].user
      )
    end

    { runs: runs }
  }
end
