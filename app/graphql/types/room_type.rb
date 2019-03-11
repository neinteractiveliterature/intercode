class Types::RoomType < Types::BaseObject
  field :id, Integer, null: false
  field :name, String, null: true
  field :runs, [Types::RunType], null: false

  association_loaders Room, :runs
end
