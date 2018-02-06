Types::RoomType = GraphQL::ObjectType.define do
  name 'Room'
  field :id, types.Int
  field :runs, types[Types::RunType] do
    resolve ->(obj, _args, _ctx) {
      AssociationLoader.for(Room, :runs).load(obj)
    }
  end
  field :name, types.String
end
