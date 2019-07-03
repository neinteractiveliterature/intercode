class Mutations::DeleteStaffPosition < Mutations::BaseMutation
  field :staff_position, Types::StaffPositionType, null: false

  argument :id, Integer, required: true

  load_and_authorize_convention_associated_model :staff_positions, :id, :destroy

  def resolve(**_args)
    staff_position.destroy!

    { staff_position: staff_position }
  end
end
