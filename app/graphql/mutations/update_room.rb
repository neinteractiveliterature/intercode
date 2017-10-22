Mutations::UpdateRoom = GraphQL::Relay::Mutation.define do
  name "UpdateRoom"
  return_field :room, Types::RoomType

  input_field :id, !types.Int
  input_field :room, !Types::RoomInputType

  resolve ->(_obj, args, ctx) {
    room = ctx[:convention].rooms.find(args[:id])

    room.update!(args[:room].to_h)

    { room: room }
  }
end
