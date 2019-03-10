class Mutations::CreateRun < Mutations::BaseMutation
  field :run, Types::RunType, null: false

  argument :event_id, Integer, required: true, camelize: false
  argument :run, Types::RunInputType, required: true

  def resolve(**args)
    event = convention.events.find(args[:event_id])

    run = event.runs.create!(
      args[:run].to_h.merge(
        updated_by: user_con_profile.user
      )
    )

    { run: run }
  end
end
