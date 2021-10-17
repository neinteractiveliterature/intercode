# frozen_string_literal: true
class Types::RoomType < Types::BaseObject
  field :id,
        Integer,
        deprecation_reason:
          "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
  field :name, String, null: true
  field :runs, [Types::RunType], null: false

  association_loaders Room, :runs
end
