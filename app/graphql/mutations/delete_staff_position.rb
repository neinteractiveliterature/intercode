Mutations::DeleteStaffPosition = GraphQL::Relay::Mutation.define do
  name 'DeleteStaffPosition'
  return_field :staff_position, Types::StaffPositionType

  input_field :id, !types.Int

  resolve ->(_obj, args, ctx) {
    staff_position = ctx[:convention].staff_positions.find(args[:id])
    staff_position.destroy!

    { staff_position: staff_position }
  }
end
