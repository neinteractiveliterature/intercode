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
      pass_number = 0
      loop do
        executed_choices_this_pass = execute_pass(pass_number)
        break if executed_choices_this_pass.blank?
        pass_number += 1
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
    when "asc", "asc_serpentine"
      scope.order(lottery_number: :asc)
    when "desc", "desc_serpentine"
      scope.order(lottery_number: :desc)
    else
      raise "Unknown order for executing signup choices: #{signup_round.ranked_choice_order.inspect}"
    end
  end

  def execute_pass(pass_number)
    prev_decisions = @decisions.dup

    ActiveRecord::Base.transaction do
      user_con_profiles = ordered_user_con_profiles.to_a
      user_con_profiles.reverse! if signup_round.serpentine_ranked_choice_order? && pass_number.odd?

      executed_choices =
        user_con_profiles.filter_map { |user_con_profile| execute_choices_for_user_con_profile(user_con_profile) }

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

    execute_fallback_for_user_con_profile(user_con_profile, pending_choices:, constraints:)
  end

  def execute_fallback_for_user_con_profile(user_con_profile, pending_choices:, constraints:)
    case user_con_profile.ranked_choice_fallback_action
    when "waitlist"
      pending_choices.find { |choice| execute_choice(constraints, choice, allow_waitlist: true) }
    when "random_signup"
      picked_choice = generate_random_choice_for_user_con_profile(user_con_profile, pending_choices:)
      return unless picked_choice

      picked_choice.save!
      execute_choice(constraints, picked_choice, allow_waitlist: false)
    end
  end

  def generate_random_choice_for_user_con_profile(user_con_profile, pending_choices:)
    picked_choice = nil
    ActiveRecord::Base.transaction do
      potential_choices = generate_potential_random_choices_for_user_con_profile(user_con_profile, pending_choices:)
      source = Sources::SimulatedSkipReason.new(user_con_profile)
      skip_reasons = source.fetch(potential_choices)
      usable_choices = potential_choices.zip(skip_reasons).filter_map { |(choice, reason)| reason ? nil : choice }
      picked_choice = usable_choices.sample
      raise ActiveRecord::Rollback
    end
    picked_choice
  end

  def generate_potential_random_choices_for_user_con_profile(user_con_profile, pending_choices:)
    existing_target_run_ids = Set.new(pending_choices.map { |choice| choice.target_run.id })
    random_signup_eligible_runs
      .reject { |run| existing_target_run_ids.include?(run.id) }
      .map do |run|
        SignupRankedChoice.new(
          user_con_profile:,
          target_run: run,
          priority: pending_choices.size + 1,
          state: "pending",
          updated_by: user_con_profile.user
        )
      end
  end

  def random_signup_eligible_runs
    @random_signup_eligible_runs ||=
      begin
        eligible_event_ids = Event.connection.select_values(<<~SQL, "random_signup_eligible_event_ids", [convention.id])
          SELECT DISTINCT events.id from events
          INNER JOIN (
            SELECT id, jsonb_array_elements(registration_policy->'buckets')->'not_counted' bucket_not_counted
            from events where convention_id = $1
          ) bucket_not_counted ON (events.id = bucket_not_counted.id AND bucket_not_counted.bucket_not_counted != 'true')
        SQL

        Run.where(event_id: eligible_event_ids)
      end
  end

  def check_skip_user_for_policy_reasons(constraints) # rubocop:disable Naming/PredicateMethod
    unless constraints.has_ticket_if_required?
      decisions << RankedChoiceDecision.create!(
        signup_round:,
        decision: :skip_user,
        user_con_profile: constraints.user_con_profile,
        reason: :missing_ticket
      )
      return true
    end

    unless constraints.signup_count_allowed?(constraints.current_signup_count + 1)
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
        skip_locking: true,
        suppress_notifications:
      ).call!
    decisions << result.decision
    result.decision.decision != "skip_choice"
  end
end
