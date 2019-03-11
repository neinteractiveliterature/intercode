class Mutations::UpdateRoom < Mutations::BaseMutation
  field :room, Types::RoomType, null: false

  argument :id, Integer, required: true
  argument :room, Types::RoomInputType, required: true

  def resolve(**args)
    room = convention.rooms.find(args[:id])

    room.update!(args[:room].to_h)

    { room: room }
  end
end
