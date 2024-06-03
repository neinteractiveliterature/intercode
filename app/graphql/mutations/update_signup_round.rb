# frozen_string_literal: true
class Mutations::UpdateSignupRound < Mutations::BaseMutation
  description "Modify an existing SignupRound"

  field :signup_round, Types::SignupRoundType, null: false do
    description "The SignupRound that has just been reprioritized"
  end

  argument :id, ID, required: true, description: "The ID of the SignupRound to update"
  argument :signup_round,
           Types::SignupRoundInputType,
           required: true,
           description: "The new data to write to the SignupRound"

  load_and_authorize_model_with_id SignupRound, :id, :update

  def resolve(signup_round:, **_args)
    @signup_round.update!(signup_round.to_h)

    { signup_round: @signup_round }
  end
end
