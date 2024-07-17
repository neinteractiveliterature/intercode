# frozen_string_literal: true
class Types::DepartmentType < Types::BaseObject
  field :event_categories, [Types::EventCategoryType], null: false
  field :id, ID, null: false
  field :name, String, null: false
  field :proposal_description, String, null: true

  association_loaders Department, :event_categories
end
