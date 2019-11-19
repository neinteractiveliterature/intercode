class Mutations::CreateMultipleRuns < Mutations::BaseMutation
  field :runs, [Types::RunType], null: false

  argument :event_id, Integer, required: true, camelize: false
  argument :runs, [Types::RunInputType], required: true

  attr_reader :event

  define_authorization_check do |args|
    @event = convention.events.find(args[:event_id])
    policy(Run.new(event: event)).create?
  end

  def resolve(**args)
    run_attrs_hashes = args[:runs].map do |run|
      {
        starts_at: run.starts_at,
        title_suffix: run.title_suffix,
        schedule_note: run.schedule_note,
        room_ids: run.room_ids,
        updated_by: current_user
      }
    end
    runs = event.runs.create!(run_attrs_hashes)

    { runs: runs }
  end
end
