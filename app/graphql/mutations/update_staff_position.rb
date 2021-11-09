# frozen_string_literal: true
class Mutations::UpdateStaffPosition < Mutations::BaseMutation
  field :staff_position, Types::StaffPositionType, null: false

  argument :id, ID, required: false
  argument :staff_position, Types::StaffPositionInputType, required: true, camelize: false

  load_and_authorize_convention_associated_model :staff_positions, :id, :update

  def resolve(**args)
    staff_position.update!(args[:staff_position].to_h)

    { staff_position: staff_position }
  end
end
