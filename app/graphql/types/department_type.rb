# frozen_string_literal: true
class Types::DepartmentType < Types::BaseObject
  description "A group of event categories in a convention"
  field :event_categories,
        [Types::EventCategoryType],
        null: false,
        description: "The event categories in this department"
  field :id, ID, null: false, description: "The ID of this department"
  field :name, String, null: false, description: "The name of this department"
  field :proposal_description,
        String,
        null: true,
        description: "The text describing this department to people proposing events"

  association_loaders Department, :event_categories
end
