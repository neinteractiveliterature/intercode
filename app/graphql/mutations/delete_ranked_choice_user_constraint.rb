# frozen_string_literal: true
class Mutations::DeleteRankedChoiceUserConstraint < Mutations::BaseMutation
  description "Delete a RankedChoiceUserConstraint from a user's profile."

  field :ranked_choice_user_constraint, Types::RankedChoiceUserConstraintType, null: false do
    description "The constraint that has just been deleted."
  end

  argument :id, ID, required: true, description: "The ID of the constraint to delete."

  load_and_authorize_model_with_id RankedChoiceUserConstraint, :id, :destroy

  def resolve(**_args)
    ranked_choice_user_constraint.destroy!
    { ranked_choice_user_constraint: }
  end
end
