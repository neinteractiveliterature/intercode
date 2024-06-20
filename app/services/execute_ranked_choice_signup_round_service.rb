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
    prev_round =
      signup_round
        .convention
        .signup_rounds
        .reverse_chronological
        .where(start: ...signup_round.start)
        .where.not(id: signup_round.id)
        .first
    prev_max_signups = prev_round&.maximum_event_signups_as_number || 0
    return success(decisions: []) if signup_round.maximum_event_signups_as_number <= prev_max_signups

    with_relevant_locks do
      loop do
        executed_choices_this_pass = execute_pass
        break if executed_choices_this_pass.blank?
      end

      ordered_user_con_profiles.update_all(ranked_choice_ordering_boost: 0)
    end

    success(decisions:)
  end

  private

  def with_relevant_locks(&)
    with_advisory_lock_unless_skip_locking("signup_round_#{signup_round.id}", &)
  end

  def ordered_user_con_profiles
    scope = convention.user_con_profiles.order("ranked_choice_ordering_boost DESC NULLS LAST")

    case signup_round.ranked_choice_order
    when "asc"
      scope.order(lottery_number: :asc)
    when "desc"
      scope.order(lottery_number: :desc)
    else
      raise "Unknown order for executing signup choices: #{signup_round.ranked_choice_order.inspect}"
    end
  end

  def execute_pass
    prev_decisions = @decisions.dup

    ActiveRecord::Base.transaction do
      executed_choices =
        ordered_user_con_profiles.to_a.filter_map do |user_con_profile|
          execute_choices_for_user_con_profile(user_con_profile)
        end

      if executed_choices.empty?
        @decisions = prev_decisions
        raise ActiveRecord::Rollback
      end

      executed_choices
    end
  end

  def execute_choices_for_user_con_profile(user_con_profile)
    constraints = UserSignupConstraints.new(user_con_profile)
    return if check_skip_user_for_policy_reasons(constraints)

    pending_choices = user_con_profile.signup_ranked_choices.where(state: "pending").order(:priority).to_a
    unless pending_choices.any?
      decisions << RankedChoiceDecision.create!(
        signup_round:,
        decision: :skip_user,
        user_con_profile:,
        reason: :no_pending_choices
      )
      return
    end

    executed_choice = pending_choices.find { |choice| execute_choice(constraints, choice) }
    return executed_choice if executed_choice
    return unless user_con_profile.ranked_choice_allow_waitlist

    pending_choices.find { |choice| execute_choice(constraints, choice, allow_waitlist: true) }
  end

  def check_skip_user_for_policy_reasons(constraints) # rubocop:disable Metrics/MethodLength
    unless constraints.has_ticket_if_required?
      decisions << RankedChoiceDecision.create!(
        signup_round:,
        decision: :skip_user,
        user_con_profile: constraints.user_con_profile,
        reason: :missing_ticket
      )
      return true
    end

    unless constraints.signup_count_allowed?(
             constraints.current_signup_count + constraints.pending_signup_request_count + 1
           )
      decisions << RankedChoiceDecision.create!(
        signup_round:,
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
        signup_round:,
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
