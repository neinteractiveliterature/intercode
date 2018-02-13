Mutations::UpdateStaffPosition = GraphQL::Relay::Mutation.define do
  name 'UpdateStaffPosition'
  return_field :staff_position, Types::StaffPositionType

  input_field :id, !types.Int
  input_field :staff_position, !Types::StaffPositionInputType

  resolve ->(_obj, args, ctx) {
    staff_position = ctx[:convention].staff_positions.find(args[:id])

    staff_position.update!(args[:staff_position].to_h)

    { staff_position: staff_position }
  }
end
