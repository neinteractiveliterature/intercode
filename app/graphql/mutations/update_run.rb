# frozen_string_literal: true
class Mutations::UpdateRun < Mutations::BaseMutation
  field :run, Types::RunType, null: false

  argument :id, ID, required: false
  argument :run, Types::RunInputType, required: true

  load_and_authorize_model_with_id Run, :id, :update

  def resolve(**args)
    run.update!(args[:run].to_h.merge(updated_by: current_user))

    { run: }
  end
end
