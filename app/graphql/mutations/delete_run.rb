# frozen_string_literal: true
class Mutations::DeleteRun < Mutations::BaseMutation
  field :run, Types::RunType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_model_with_id Run, :id, :destroy

  def resolve(**_args)
    run.destroy!
    { run: run }
  end
end
