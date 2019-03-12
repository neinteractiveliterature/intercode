class Mutations::DeleteRoom < Mutations::BaseMutation
  field :room, Types::RoomType, null: false

  argument :id, Integer, required: true

  def resolve(**args)
    room = convention.rooms.find(args[:id])
    room.destroy!
    { room: room }
  end
end
