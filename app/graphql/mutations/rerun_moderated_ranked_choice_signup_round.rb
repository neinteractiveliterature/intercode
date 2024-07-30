# frozen_string_literal: true
class Mutations::RerunModeratedRankedChoiceSignupRound < Mutations::BaseMutation
  description <<~MARKDOWN
    In a moderated-signup convention with ranked-choice signups, this operation can be used to undo whatever signup
    requests from a round haven't yet been accepted or rejected, and rerun the round from wherever that leaves it.  Any
    undone signup requests will be moved back to the top of the user's queue, so the algorithm will attempt to re-place
    them in that event if possible.
  MARKDOWN

  field :signup_round, Types::SignupRoundType, null: false, description: "The SignupRound after being rerun."

  argument :id, ID, required: false, description: "The ID of the SignupRound to rerun."

  load_and_authorize_model_with_id SignupRound, :id, :rerun

  def resolve(**_args)
    RerunModeratedRankedChoiceSignupRoundService.new(signup_round:, whodunit: current_user).call!

    { signup_round: }
  end
end
