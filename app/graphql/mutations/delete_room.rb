# frozen_string_literal: true
class Mutations::DeleteRoom < Mutations::BaseMutation
  field :room, Types::RoomType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_convention_associated_model :rooms, :id, :destroy

  def resolve(**_args)
    room.destroy!
    { room: room }
  end
end
