# frozen_string_literal: true
class Types::DepartmentType < Types::BaseObject
  field :id,
        Int,
        deprecation_reason:
          "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
  field :name, String, null: false
  field :proposal_description, String, null: true
  field :event_categories, [Types::EventCategoryType], null: false

  association_loaders Department, :event_categories
end
