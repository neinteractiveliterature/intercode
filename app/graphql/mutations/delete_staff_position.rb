# frozen_string_literal: true
class Mutations::DeleteStaffPosition < Mutations::BaseMutation
  field :staff_position, Types::StaffPositionType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_convention_associated_model :staff_positions, :id, :destroy

  def resolve(**_args)
    staff_position.destroy!

    { staff_position: staff_position }
  end
end
