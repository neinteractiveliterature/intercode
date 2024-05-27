# frozen_string_literal: true
class Mutations::CreateSignupRound < Mutations::BaseMutation
  description "Create a new SignupRound in a convention"

  field :signup_round, Types::SignupRoundType, null: false do
    description "The SignupRound that has been created"
  end

  argument :convention_id, ID, required: true do
    description "The ID of the Convention to create a SignupRound in"
  end
  argument :signup_round, Types::SignupRoundInputType, required: false do
    description "The data for the SignupRound to create"
  end

  define_authorization_check do |args|
    @convention = Convention.find(args[:convention_id])
    @signup_round = @convention.signup_rounds.new(args[:signup_round].to_h)
    policy(@signup_round).create?
  end

  def resolve(**_args)
    @signup_round.save!

    { signup_round: @signup_round }
  end
end
