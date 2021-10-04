# frozen_string_literal: true
class Mutations::DeleteEventCategory < Mutations::BaseMutation
  field :event_category, Types::EventCategoryType, null: false, camelize: false

  argument :id,
           Int,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false,
           camelize: false
  argument :transitional_id, ID, required: false, camelize: true

  load_and_authorize_convention_associated_model :event_categories, :id, :destroy

  def resolve(**_args)
    event_category.destroy!

    { event_category: event_category }
  end
end
