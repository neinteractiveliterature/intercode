# frozen_string_literal: true
class Mutations::UpdateRoom < Mutations::BaseMutation
  field :room, Types::RoomType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :room, Types::RoomInputType, required: true

  load_and_authorize_convention_associated_model :rooms, :id, :update

  def resolve(**args)
    room = convention.rooms.find(args[:id])

    room.update!(args[:room].to_h)

    { room: room }
  end
end
