# frozen_string_literal: true
class Mutations::DeleteRun < Mutations::BaseMutation
  field :run, Types::RunType, null: false

  argument :id, ID, required: false

  load_and_authorize_model_with_id Run, :id, :destroy

  def resolve(**_args)
    run.destroy!
    { run: run }
  end
end
