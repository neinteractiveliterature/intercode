class Types::RoomType < Types::BaseObject
  field :id, Integer, null: true
  field :runs, [Types::RunType, null: true], null: true

  def runs
    AssociationLoader.for(Room, :runs).load(@object)
  end
  field :name, String, null: true
end
