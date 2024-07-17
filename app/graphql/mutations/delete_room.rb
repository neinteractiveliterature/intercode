# frozen_string_literal: true
class Mutations::DeleteRoom < Mutations::BaseMutation
  field :room, Types::RoomType, null: false

  argument :id, ID, required: false

  load_and_authorize_convention_associated_model :rooms, :id, :destroy

  def resolve(**_args)
    room.destroy!
    { room: room }
  end
end
