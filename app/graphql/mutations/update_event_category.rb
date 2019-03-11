class Mutations::UpdateEventCategory < Mutations::BaseMutation
  field :event_category, Types::EventCategoryType, null: false, camelize: false

  argument :id, Int, required: true, camelize: false
  argument :event_category, Types::EventCategoryInputType, required: true, camelize: false

  def resolve(id:, event_category:)
    event_category_model = context[:convention].event_categories.find(id)
    event_category_model.update!(event_category.to_h)

    { event_category: event_category_model }
  end
end
