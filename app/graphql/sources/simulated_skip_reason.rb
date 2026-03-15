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
      result = keys.map { |signup_ranked_choice| simulate_skip_reason(signup_ranked_choice) }
      raise ActiveRecord::Rollback
    end

    result
  end

  private

  def simulate_skip_reason(signup_ranked_choice)
    original_prioritize_waitlist = signup_ranked_choice.prioritize_waitlist

    # Temporarily set prioritize_waitlist = false to detect if the event is full, so that the frontend can show
    # the appropriate message about it (even when prioritize_waitlist is true, we want to show the event is full)
    signup_ranked_choice.prioritize_waitlist = false
    base_skip = skip_reason_for(signup_ranked_choice)
    signup_ranked_choice.prioritize_waitlist = original_prioritize_waitlist

    # If the event is full and the choice has prioritize_waitlist with a cap, check whether the cap would be
    # exceeded (which would cause the choice to be skipped despite prioritize_waitlist being true)
    if base_skip&.reason == :full && original_prioritize_waitlist && signup_ranked_choice.waitlist_position_cap.present?
      cap_skip = skip_reason_for(signup_ranked_choice)
      # cap_skip is nil if within the cap (would be waitlisted OK), or waitlist_position_cap_exceeded if not
      return cap_skip.nil? ? base_skip : cap_skip
    end

    base_skip
  end

  def skip_reason_for(signup_ranked_choice)
    ExecuteRankedChoiceSignupService.new(
      signup_round: nil,
      whodunit: nil,
      signup_ranked_choice:,
      allow_waitlist: false,
      constraints:
    ).skip_reason
  end
end
