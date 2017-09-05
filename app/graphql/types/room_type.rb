Types::RoomType = GraphQL::ObjectType.define do
  name "Room"
  field :runs, types[Types::RunType]
  field :name, types.String
end
