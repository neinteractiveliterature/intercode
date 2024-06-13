# frozen_string_literal: true
class Mutations::UpdateSignupRankedChoicePriority < Mutations::BaseMutation
  description "Change the priority of a SignupRankedChoice in a user's queue"

  field :signup_ranked_choice, Types::SignupRankedChoiceType, null: false do
    description "The SignupRankedChoice that has just been reprioritized"
  end

  argument :id, ID, required: true, description: "The ID of the SignupRankedChoice to update"
  argument :priority, Int, required: true, description: "The new priority to set the SignupRankedChoice to"

  load_and_authorize_model_with_id SignupRankedChoice, :id, :update

  def resolve(priority:, **_args)
    signup_ranked_choice.update!(priority:)

    { signup_ranked_choice: }
  end
end
