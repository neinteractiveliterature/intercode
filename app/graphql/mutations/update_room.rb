# frozen_string_literal: true
class Mutations::UpdateRoom < Mutations::BaseMutation
  field :room, Types::RoomType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :room, Types::RoomInputType, required: true

  load_and_authorize_convention_associated_model :rooms, :id, :update

  def resolve(**args)
    room.update!(args[:room].to_h)

    { room: room }
  end
end
