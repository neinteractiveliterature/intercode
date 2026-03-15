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
  argument :waitlist_position_cap, # rubocop:disable GraphQL/ExtractInputType
           Integer,
           required: false,
           description:
             "Only prioritize waitlisting if the resulting position would be at or below this number. " \
               "Null means no cap.  Only relevant when prioritize_waitlist is true."

  load_and_authorize_model_with_id SignupRankedChoice, :id, :update

  def resolve(prioritize_waitlist:, waitlist_position_cap: :not_provided, **_args)
    attrs = { prioritize_waitlist: }
    attrs[:waitlist_position_cap] = waitlist_position_cap unless waitlist_position_cap == :not_provided
    signup_ranked_choice.update!(attrs)

    { signup_ranked_choice: }
  end
end
