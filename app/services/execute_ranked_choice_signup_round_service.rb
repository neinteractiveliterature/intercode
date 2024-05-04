# frozen_string_literal: true
class ExecuteRankedChoiceSignupRoundService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :decisions
  end
  self.result_class = Result

  include SkippableAdvisoryLock

  attr_reader :signup_round, :whodunit, :skip_locking, :suppress_notifications, :decisions
  delegate :convention, to: :signup_round

  def initialize(signup_round:, whodunit:, skip_locking: false, suppress_notifications: false)
    @signup_round = signup_round
    @whodunit = whodunit
    @skip_locking = skip_locking
    @suppress_notifications = suppress_notifications
    @decisions = []
  end

  def inner_call
    SignupRound.transaction do
      with_relevant_locks do
        signup_round.update!(executed_at: Time.zone.now)
        ordered_user_con_profiles.to_a.each do |user_con_profile|
          execute_choices_for_user_con_profile(user_con_profile)
        end
      end
    end

    success(decisions:)
  end

  private

  def with_relevant_locks(&)
    with_advisory_lock_unless_skip_locking("signup_round_#{signup_round.id}", &)
  end

  def ordered_user_con_profiles
    case signup_round.ranked_choice_order
    when "asc"
      convention.user_con_profiles.order(lottery_number: :asc)
    when "desc"
      convention.user_con_profiles.order(lottery_number: :desc)
    else
      raise "Unknown order for executing signup choices: #{signup_round.ranked_choice_order.inspect}"
    end
  end

  def execute_choices_for_user_con_profile(user_con_profile)
    constraints = UserSignupConstraints.new(user_con_profile)
    return if check_skip_user_for_policy_reasons(constraints)

    pending_choices = user_con_profile.signup_ranked_choices.where(state: "pending").order(:priority).to_a
    unless pending_choices.any?
      decisions << RankedChoiceDecision.create!(decision: :skip_user, user_con_profile:, reason: :no_pending_choices)
      return
    end

    executed_choice = pending_choices.find { |choice| execute_choice(constraints, choice) }
    return executed_choice if executed_choice
    return unless user_con_profile.ranked_choice_allow_waitlist

    pending_choices.find { |choice| execute_choice(constraints, choice, allow_waitlist: true) }
  end

  def check_skip_user_for_policy_reasons(constraints)
    unless constraints.has_ticket_if_required?
      decisions << RankedChoiceDecision.create!(
        decision: :skip_user,
        user_con_profile: constraints.user_con_profile,
        reason: :missing_ticket
      )
      return true
    end

    unless constraints.signup_count_allowed?(constraints.current_signup_count + 1)
      decisions << RankedChoiceDecision.create!(
        decision: :skip_user,
        user_con_profile: constraints.user_con_profile,
        reason: :no_more_signups_allowed
      )
      return true
    end

    false
  end

  def execute_choice(constraints, signup_ranked_choice, allow_waitlist: false)
    result =
      ExecuteRankedChoiceSignupService.new(
        whodunit:,
        signup_ranked_choice:,
        allow_waitlist:,
        constraints:,
        skip_locking:,
        suppress_notifications:
      ).call!
    decisions << result.decision
    result.decision.decision != "skip_choice"
  end
end
