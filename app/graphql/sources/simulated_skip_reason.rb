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
          ExecuteRankedChoiceSignupService.new(
            signup_round: nil,
            whodunit: nil,
            signup_ranked_choice:,
            # simulate: true makes the service always return a reason for full events (so the frontend can show the
            # appropriate message), while still correctly reporting waitlist_position_cap_exceeded when applicable
            allow_waitlist: false,
            simulate: true,
            constraints:
          ).skip_reason
        end
      raise ActiveRecord::Rollback
    end

    result
  end
end
