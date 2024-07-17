# frozen_string_literal: true
class Mutations::UpdateRoom < Mutations::BaseMutation
  field :room, Types::RoomType, null: false

  argument :id, ID, required: false
  argument :room, Types::RoomInputType, required: true

  load_and_authorize_convention_associated_model :rooms, :id, :update

  def resolve(**args)
    room.update!(args[:room].to_h)

    { room: }
  end
end
