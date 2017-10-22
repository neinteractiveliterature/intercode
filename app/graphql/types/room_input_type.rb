Types::RoomInputType = GraphQL::InputObjectType.define do
  name "RoomInput"
  input_field :name, types.String
end
