Mutations::CreateStaffPosition = GraphQL::Relay::Mutation.define do
  name 'CreateStaffPosition'
  return_field :staff_position, Types::StaffPositionType

  input_field :staff_position, !Types::StaffPositionInputType

  resolve ->(_obj, args, ctx) {
    staff_position = ctx[:convention].staff_positions.create!(args[:staff_position].to_h)
    { staff_position: staff_position }
  }
end
