class Mutations::CreateRoom < Mutations::BaseMutation
  field :room, Types::RoomType, null: false

  argument :room, Types::RoomInputType, required: true

  def resolve(**args)
    room = convention.rooms.create!(args[:room].to_h)

    { room: room }
  end
end
