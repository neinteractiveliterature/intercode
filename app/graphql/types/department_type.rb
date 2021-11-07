# frozen_string_literal: true
class Types::DepartmentType < Types::BaseObject
  field :transitional_id,
        ID,
        deprecation_reason:
          "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
        null: false,
        method: :id,
        camelize: true
  field :id, ID, null: false
  field :name, String, null: false
  field :proposal_description, String, null: true
  field :event_categories, [Types::EventCategoryType], null: false

  association_loaders Department, :event_categories
end
