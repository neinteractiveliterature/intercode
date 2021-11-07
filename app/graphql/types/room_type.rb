# frozen_string_literal: true
class Types::RoomType < Types::BaseObject
  field :transitional_id,
        ID,
        deprecation_reason:
          "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
        null: false,
        method: :id,
        camelize: true
  field :id, ID, null: false
  field :name, String, null: true
  field :runs, [Types::RunType], null: false

  association_loaders Room, :runs
end
