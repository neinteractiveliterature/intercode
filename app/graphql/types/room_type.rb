# frozen_string_literal: true
class Types::RoomType < Types::BaseObject
  field :id, ID, null: false
  field :name, String, null: true
  field :runs, [Types::RunType], null: false

  association_loaders Room, :runs
end
