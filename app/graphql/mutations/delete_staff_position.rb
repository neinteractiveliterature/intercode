# frozen_string_literal: true
class Mutations::DeleteStaffPosition < Mutations::BaseMutation
  field :staff_position, Types::StaffPositionType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_convention_associated_model :staff_positions, :id, :destroy

  def resolve(**_args)
    staff_position.destroy!

    { staff_position: staff_position }
  end
end
