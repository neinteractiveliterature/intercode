# frozen_string_literal: true
class Mutations::UpdateEventCategory < Mutations::BaseMutation
  field :event_category, Types::EventCategoryType, null: false, camelize: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
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
