# frozen_string_literal: true
class Mutations::CreateRoom < Mutations::BaseMutation
  field :room, Types::RoomType, null: false

  argument :room, Types::RoomInputType, required: true
  authorize_create_convention_associated_model :rooms

  def resolve(**args)
    room = convention.rooms.create!(args[:room].to_h)

    { room: }
  end
end
