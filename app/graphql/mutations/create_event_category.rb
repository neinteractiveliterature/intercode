class Mutations::CreateEventCategory < Mutations::BaseMutation
  field :event_category, Types::EventCategoryType, null: false

  argument :event_category, Types::EventCategoryInputType, required: true, camelize: false

  authorize_create_convention_associated_model :event_categories

  def resolve(event_category:)
    event_category_model = context[:convention].event_categories.create!(event_category.to_h)
    { event_category: event_category_model }
  end
end
