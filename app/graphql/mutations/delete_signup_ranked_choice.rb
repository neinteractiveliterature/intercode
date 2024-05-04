# frozen_string_literal: true
class Mutations::DeleteSignupRankedChoice < Mutations::BaseMutation
  description "Deletes a SignupRankedChoice from a user's signup queue"

  field :signup_ranked_choice, Types::SignupRankedChoiceType, null: false do
    description "The SignupRankedChoice that has been deleted"
  end

  argument :id, ID, required: true, description: "The ID of the SignupRankedChoice to delete"

  load_and_authorize_model_with_id SignupRankedChoice, :id, :destroy

  def resolve(**_args)
    signup_ranked_choice.destroy!

    { signup_ranked_choice: }
  end
end
