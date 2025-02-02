# frozen_string_literal: true
class Mutations::SetSignupRankedChoicePrioritizeWaitlist < Mutations::BaseMutation
  description "Set whether or not a SignupRankedChoice should prioritize itself if an event is full"

  field :signup_ranked_choice, Types::SignupRankedChoiceType, null: false do
    description "The SignupRankedChoice that has just been modified"
  end

  argument :id, ID, required: true, description: "The ID of the SignupRankedChoice to update"
  argument :prioritize_waitlist,
           Boolean,
           required: true,
           description: "Should this SignupRankedChoice prioritize itself for full events?"

  load_and_authorize_model_with_id SignupRankedChoice, :id, :update

  def resolve(prioritize_waitlist:, **_args)
    signup_ranked_choice.update!(prioritize_waitlist:)

    { signup_ranked_choice: }
  end
end
