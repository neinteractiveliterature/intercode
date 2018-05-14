Mutations::CreateMultipleRuns = GraphQL::Relay::Mutation.define do
  name 'CreateMultipleRuns'
  return_field :runs, !types[!Types::RunType]

  input_field :event_id, !types.Int
  input_field :runs, !types[!Types::RunInputType]

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
