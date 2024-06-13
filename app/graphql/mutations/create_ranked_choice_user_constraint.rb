# frozen_string_literal: true
class Mutations::CreateRankedChoiceUserConstraint < Mutations::BaseMutation
  description "Create a new RankedChoiceUserConstraint"

  field :ranked_choice_user_constraint, Types::RankedChoiceUserConstraintType, null: false do
    description "The RankedChoiceUserConstraint that has just been created."
  end

  argument :ranked_choice_user_constraint, Types::RankedChoiceUserConstraintInputType, required: true do
    description "The constraint to create."
  end
  argument :user_con_profile_id, ID, required: false do
    description "The user profile to apply this constraint to.  If not specified, will use the current user profile."
  end

  def authorized?(ranked_choice_user_constraint:, user_con_profile_id: nil)
    profile = (user_con_profile_id ? UserConProfile.find(user_con_profile_id) : user_con_profile)

    @ranked_choice_user_constraint = profile.ranked_choice_user_constraints.new(ranked_choice_user_constraint.to_h)
    self.class.check_authorization(policy(@ranked_choice_user_constraint), :create)
  end

  def resolve(**_args)
    @ranked_choice_user_constraint.save!
    { ranked_choice_user_constraint: @ranked_choice_user_constraint }
  end
end
