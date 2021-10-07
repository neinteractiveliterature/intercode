# frozen_string_literal: true
class Mutations::CreateEventCategory < Mutations::BaseMutation
  field :event_category, Types::EventCategoryType, null: false

  argument :event_category, Types::EventCategoryInputType, required: true, camelize: false

  authorize_create_convention_associated_model :event_categories

  def resolve(event_category:)
    attrs =
      process_transitional_ids_in_input(event_category.to_h, :department_id, :event_form_id, :event_proposal_form_id)
    event_category_model = context[:convention].event_categories.create!(attrs)
    { event_category: event_category_model }
  end
end
