class Types::DepartmentType < Types::BaseObject
  field :id, Int, null: false
  field :name, String, null: false
  field :proposal_description, String, null: true
  field :event_categories, [Types::EventCategoryType], null: false

  association_loaders Department, :event_categories
end
