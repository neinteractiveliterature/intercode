# frozen_string_literal: true
class Mutations::UpdateRun < Mutations::BaseMutation
  field :run, Types::RunType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :run, Types::RunInputType, required: true

  load_and_authorize_model_with_id Run, :id, :update

  def resolve(**args)
    run.update!(process_transitional_ids_in_input(args[:run].to_h, :room_ids).merge(updated_by: current_user))

    { run: run }
  end
end
