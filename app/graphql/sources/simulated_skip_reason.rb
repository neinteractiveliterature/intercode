# frozen_string_literal: true
class Sources::SimulatedSkipReason < GraphQL::Dataloader::Source
  attr_reader :user_con_profile, :constraints

  def initialize(user_con_profile)
    @user_con_profile = user_con_profile
    @constraints = UserSignupConstraints.new(user_con_profile)
  end

  def fetch(keys)
    result = nil

    # Do this in an always-rolled-back transaction to avoid the possibility of accidentally modifying records
    ActiveRecord::Base.transaction do
      result =
        keys.map do |signup_ranked_choice|
          signup_ranked_choice.prioritize_waitlist = false
          ExecuteRankedChoiceSignupService.new(
            signup_round: nil,
            whodunit: nil,
            signup_ranked_choice:,
            # Always simulate a skip if the user would be waitlisted, so that the frontend can show the appropriate
            # message about it
            allow_waitlist: false,
            constraints:
          ).skip_reason
        end
      raise ActiveRecord::Rollback
    end

    result
  end
end
