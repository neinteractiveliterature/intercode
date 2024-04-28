# frozen_string_literal: true
class Mutations::UpdateSignupRankedChoicePriority < Mutations::BaseMutation
  field :signup_ranked_choice, Types::SignupRankedChoiceType, null: false

  argument :id, ID, required: true
  argument :priority, Int, required: true

  load_and_authorize_model_with_id SignupRankedChoice, :id, :update

  def resolve(priority:, **_args)
    signup_ranked_choice.update!(priority: priority)

    { signup_ranked_choice: signup_ranked_choice }
  end
end
