# frozen_string_literal: true
class Mutations::CreateRun < Mutations::BaseMutation
  field :run, Types::RunType, null: false

  argument :transitional_event_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the eventId field so that \
we can remove this temporary one.",
           required: false,
           camelize: false
  argument :event_id, ID, required: false, camelize: true
  argument :run, Types::RunInputType, required: true

  attr_reader :event

  define_authorization_check do |args|
    @event = convention.events.find(args[:transitional_event_id] || args[:event_id])
    policy(Run.new(event: event)).create?
  end

  def resolve(**args)
    run =
      event.runs.create!(process_transitional_ids_in_input(args[:run].to_h, :room_ids).merge(updated_by: current_user))

    { run: run }
  end
end
