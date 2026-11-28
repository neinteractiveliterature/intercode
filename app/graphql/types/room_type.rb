# frozen_string_literal: true
class Types::RoomType < Types::BaseObject
  description "A place where runs can be scheduled"
  field :id, ID, null: false, description: "The ID of this room"
  field :name, String, null: true, description: "The name of this room"
  field :runs, [Types::RunType], association_model: Room, null: false, description: "The runs scheduled in this room"
end
