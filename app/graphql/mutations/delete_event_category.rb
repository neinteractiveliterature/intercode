class Mutations::DeleteEventCategory < Mutations::BaseMutation
  field :event_category, Types::EventCategoryType, null: false, camelize: false

  argument :id, Int, required: true, camelize: false

  def resolve(id:)
    event_category = context[:convention].event_categories.find(id)
    event_category.destroy!

    { event_category: event_category }
  end
end
