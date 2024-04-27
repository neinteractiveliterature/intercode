# frozen_string_literal: true
class Mutations::DeleteSignupRankedChoice < Mutations::BaseMutation
  field :signup_ranked_choice, Types::SignupRankedChoiceType, null: false

  argument :id, ID, required: false

  load_and_authorize_model_with_id SignupRankedChoice, :id, :destroy

  def resolve(**_args)
    signup_ranked_choice.destroy!

    { signup_ranked_choice: signup_ranked_choice }
  end
end
