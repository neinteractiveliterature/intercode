# frozen_string_literal: true
class Mutations::CreateMultipleRuns < Mutations::BaseMutation
  field :runs, [Types::RunType], null: false

  argument :transitional_event_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the eventId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :event_id, ID, required: false, camelize: true
  argument :runs, [Types::RunInputType], required: true

  attr_reader :event

  define_authorization_check do |args|
    @event = convention.events.find(args[:transitional_event_id] || args[:event_id])
    policy(Run.new(event: event)).create?
  end

  def resolve(**args)
    run_attrs_hashes =
      args[:runs].map do |run|
        {
          starts_at: run.starts_at,
          title_suffix: run.title_suffix,
          schedule_note: run.schedule_note,
          room_ids: run.transitional_room_ids || run.room_ids,
          updated_by: current_user
        }
      end
    runs = event.runs.create!(run_attrs_hashes)

    { runs: runs }
  end
end
