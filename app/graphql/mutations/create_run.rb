# frozen_string_literal: true
class Mutations::CreateRun < Mutations::BaseMutation
  field :run, Types::RunType, null: false

  argument :event_id, ID, required: false, camelize: true
  argument :run, Types::RunInputType, required: true

  attr_reader :event

  define_authorization_check do |args|
    @event = convention.events.find(args[:event_id])
    policy(Run.new(event:)).create?
  end

  def resolve(**args)
    run = event.runs.create!(args[:run].to_h.merge(updated_by: current_user))

    { run: }
  end
end
