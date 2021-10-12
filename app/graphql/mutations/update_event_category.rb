# frozen_string_literal: true
class Mutations::UpdateEventCategory < Mutations::BaseMutation
  field :event_category, Types::EventCategoryType, null: false, camelize: false

  argument :id,
           Int,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :event_category, Types::EventCategoryInputType, required: true, camelize: false

  load_and_authorize_convention_associated_model :event_categories, :id, :update

  def resolve(**args)
    attrs =
      process_transitional_ids_in_input(
        args[:event_category].to_h,
        :department_id,
        :event_form_id,
        :event_proposal_form_id
      )
    event_category.update!(attrs)

    { event_category: event_category }
  end
end
