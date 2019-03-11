class Mutations::DeleteRun < Mutations::BaseMutation
  field :run, Types::RunType, null: false

  argument :id, Integer, required: true

  def resolve(**args)
    run = convention.runs.find(args[:id])
    run.destroy!
    { run: run }
  end
end
