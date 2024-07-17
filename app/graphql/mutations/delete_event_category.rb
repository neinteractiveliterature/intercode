# frozen_string_literal: true
class Mutations::DeleteEventCategory < Mutations::BaseMutation
  field :event_category, Types::EventCategoryType, null: false, camelize: false

  argument :id, ID, required: false

  load_and_authorize_convention_associated_model :event_categories, :id, :destroy

  def resolve(**_args)
    event_category.destroy!

    { event_category: }
  end
end
