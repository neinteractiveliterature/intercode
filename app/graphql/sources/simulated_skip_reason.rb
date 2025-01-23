# frozen_string_literal: true
class Sources::SimulatedSkipReason < GraphQL::Dataloader::Source
  attr_reader :user_con_profile, :constraints

  def initialize(user_con_profile)
    @user_con_profile = user_con_profile
    @constraints = UserSignupConstraints.new(user_con_profile)
  end

  def fetch(keys)
    keys.map do |signup_ranked_choice|
      ExecuteRankedChoiceSignupService.new(
        signup_round: nil,
        whodunit: nil,
        signup_ranked_choice:,
        allow_waitlist: user_con_profile.ranked_choice_allow_waitlist,
        constraints:
      ).skip_reason
    end
  end
end
