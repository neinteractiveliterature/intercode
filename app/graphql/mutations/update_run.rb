# frozen_string_literal: true
class Mutations::UpdateRun < Mutations::BaseMutation
  field :run, Types::RunType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :run, Types::RunInputType, required: true

  load_and_authorize_model_with_id Run, :id, :update

  def resolve(**args)
    run.update!(process_transitional_ids_in_input(args[:run].to_h, :room_ids).merge(updated_by: current_user))

    { run: run }
  end
end
