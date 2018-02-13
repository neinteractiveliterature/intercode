Types::StaffPositionInputType = GraphQL::InputObjectType.define do
  name 'StaffPositionInput'
  input_field :name, types.String
  input_field :email, types.String
  input_field :visible, types.Boolean
  input_field :user_con_profile_ids, types[types.Int]
end
