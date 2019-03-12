class Mutations::UpdateStaffPosition < Mutations::BaseMutation
  field :staff_position, Types::StaffPositionType, null: false

  argument :id, Integer, required: true
  argument :staff_position, Types::StaffPositionInputType, required: true, camelize: false

  def resolve(**args)
    staff_position = convention.staff_positions.find(args[:id])
    staff_position.update!(args[:staff_position].to_h)

    { staff_position: staff_position }
  end
end
