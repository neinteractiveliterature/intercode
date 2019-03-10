class Mutations::CreateMultipleRuns < Mutations::BaseMutation
  field :runs, [Types::RunType], null: false

  argument :event_id, Integer, required: true, camelize: false
  argument :runs, [Types::RunInputType], required: true

  def resolve(**args)
    event = convention.events.find(args[:event_id])

    runs = args[:runs].map do |run|
      event.runs.create!(
        starts_at: run[:starts_at],
        title_suffix: run[:title_suffix],
        schedule_note: run[:schedule_note],
        room_ids: run[:room_ids],
        updated_by: user_con_profile.user
      )
    end

    { runs: runs }
  end
end
