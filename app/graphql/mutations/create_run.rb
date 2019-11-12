class Mutations::CreateRun < Mutations::BaseMutation
  field :run, Types::RunType, null: false

  argument :event_id, Integer, required: true, camelize: false
  argument :run, Types::RunInputType, required: true

  attr_reader :event

  define_authorization_check do |args|
    @event = convention.events.find(args[:event_id])
    policy(Run.new(event: event)).create?
  end

  def resolve(**args)
    run = event.runs.create!(args[:run].to_h.merge(updated_by: current_user))

    { run: run }
  end
end
