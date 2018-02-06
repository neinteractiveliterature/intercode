Mutations::CreateRoom = GraphQL::Relay::Mutation.define do
  name 'CreateRoom'
  return_field :room, Types::RoomType

  input_field :room, !Types::RoomInputType

  resolve ->(_obj, args, ctx) {
    room = ctx[:convention].rooms.create!(args[:room].to_h)

    { room: room }
  }
end
