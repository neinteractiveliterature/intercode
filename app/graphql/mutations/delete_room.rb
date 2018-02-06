Mutations::DeleteRoom = GraphQL::Relay::Mutation.define do
  name 'DeleteRoom'
  return_field :room, Types::RoomType

  input_field :id, !types.Int

  resolve ->(_obj, args, ctx) {
    room = ctx[:convention].rooms.find(args[:id])
    room.destroy!
    { room: room }
  }
end
