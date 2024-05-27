# frozen_string_literal: true
class Mutations::DeleteSignupRound < Mutations::BaseMutation
  description "Deletes a SignupRound from a convention"

  field :signup_round, Types::SignupRoundType, null: false do
    description "The SignupRound that has been deleted"
  end

  argument :id, ID, required: true, description: "The ID of the SignupRound to delete"

  load_and_authorize_model_with_id SignupRound, :id, :destroy

  def resolve(**_args)
    signup_round.destroy!

    { signup_round: }
  end
end
