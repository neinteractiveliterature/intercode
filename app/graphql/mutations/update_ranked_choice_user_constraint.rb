# frozen_string_literal: true
class Mutations::UpdateRankedChoiceUserConstraint < Mutations::BaseMutation
  description "Update a RankedChoiceUserConstraint by ID."

  field :ranked_choice_user_constraint, Types::RankedChoiceUserConstraintType, null: false do
    description "The constraint after being updated."
  end

  argument :id, ID, required: true, description: "The ID of the constraint to update."
  argument :ranked_choice_user_constraint, Types::RankedChoiceUserConstraintInputType, required: true do
    description "The updated values to use for this constraint."
  end

  load_and_authorize_model_with_id RankedChoiceUserConstraint, :id, :update

  def resolve(**args)
    ranked_choice_user_constraint.update!(args[:ranked_choice_user_constraint].to_h)

    { ranked_choice_user_constraint: }
  end
end
