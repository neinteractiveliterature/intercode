# frozen_string_literal: true
class Mutations::UpdateEventCategory < Mutations::BaseMutation
  field :event_category, Types::EventCategoryType, null: false, camelize: false

  argument :id, ID, required: false
  argument :event_category, Types::EventCategoryInputType, required: true, camelize: false

  load_and_authorize_convention_associated_model :event_categories, :id, :update

  def resolve(**args)
    event_category.update!(args[:event_category].to_h)

    { event_category: event_category }
  end
end
