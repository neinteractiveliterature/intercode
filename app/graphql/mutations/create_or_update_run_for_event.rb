# frozen_string_literal: true
class Mutations::CreateOrUpdateRunForEvent < Mutations::BaseMutation
  description <<~MARKDOWN
    Create or update a run for an event. If a run already exists, it will be updated; otherwise, a new run will be
    created.
  MARKDOWN

  field :run, Types::RunType, null: false, description: "The created or updated run."

  argument :event_id, ID, required: false, camelize: true, description: "The ID of the event the run is for."
  argument :run, Types::RunInputType, required: true, description: "The run attributes to create or update."

  attr_reader :event

  define_authorization_check do |args|
    @event = convention.events.find(args[:event_id])
    policy(Run.new(event:)).create?
  end

  def resolve(**args)
    existing_run = event.runs.first

    if existing_run
      existing_run.update!(args[:run].to_h.merge(updated_by: current_user))
      { run: existing_run }
    else
      run = event.runs.create!(args[:run].to_h.merge(updated_by: current_user))
      { run: }
    end
  end
end
