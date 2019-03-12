class Mutations::UpdateRun < Mutations::BaseMutation
  field :run, Types::RunType, null: false

  argument :id, Integer, required: true
  argument :run, Types::RunInputType, required: true

  def resolve(**args)
    run = convention.runs.find(args[:id])

    run.update!(
      args[:run].to_h.merge(
        updated_by: user_con_profile.user
      )
    )

    { run: run }
  end
end
