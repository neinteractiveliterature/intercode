class Mutations::DeleteStaffPosition < Mutations::BaseMutation
  field :staff_position, Types::StaffPositionType, null: false

  argument :id, Integer, required: true

  def resolve(**args)
    staff_position = convention.staff_positions.find(args[:id])
    staff_position.destroy!

    { staff_position: staff_position }
  end
end
