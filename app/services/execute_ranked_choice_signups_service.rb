# frozen_string_literal: true
class ExecuteRankedChoiceSignupsService < CivilService::Service
  class RankedChoiceDecision
    attr_reader :user_con_profile, :decision, :reason, :signup_ranked_choice, :signup, :extra

    def initialize(user_con_profile:, decision:, reason: nil, signup_ranked_choice: nil, signup: nil, **extra)
      @user_con_profile = user_con_profile
      @decision = decision
      @reason = reason
      @signup_ranked_choice = signup_ranked_choice
      @signup = signup
      @extra = extra
    end
  end

  class Result < CivilService::Result
    attr_accessor :decisions
  end
  self.result_class = Result

  attr_reader :convention, :whodunit, :order, :skip_locking, :suppress_notifications, :decisions

  def initialize(convention:, whodunit:, order:, skip_locking: false, suppress_notifications: false)
    @convention = convention
    @whodunit = whodunit
    @order = order
    @skip_locking = skip_locking
    @suppress_notifications = suppress_notifications
    @decisions = []
  end

  def inner_call
    ordered_user_con_profiles.to_a.each { |user_con_profile| execute_choices_for_user_con_profile(user_con_profile) }

    success(decisions: decisions)
  end

  private

  def ordered_user_con_profiles
    case order
    when :asc
      convention.user_con_profiles.order(lottery_number: :asc)
    when :desc
      convention.user_con_profiles.order(lottery_number: :desc)
    else
      raise "Unknown order for executing signup choices: #{order.inspect}"
    end
  end

  def execute_choices_for_user_con_profile(user_con_profile)
    constraints = UserSignupConstraints.new(user_con_profile)
    unless constraints.has_ticket_if_required?
      log_skip_user(user_con_profile: user_con_profile, reason: :missing_ticket)
      return
    end

    unless constraints.signup_count_allowed?(constraints.current_signup_count + 1)
      log_skip_user(user_con_profile: user_con_profile, reason: :no_more_signups_allowed)
      return
    end

    pending_choices = user_con_profile.signup_ranked_choices.where(state: "pending").order(:priority).to_a
    unless pending_choices.any?
      log_skip_user(user_con_profile: user_con_profile, reason: :no_pending_choices)
      return
    end

    signup = pending_choices.find { |choice| execute_choice(user_con_profile, constraints, choice) }
    signup ||
      pending_choices.find { |choice| execute_choice(user_con_profile, constraints, choice, allow_waitlist: true) }
  end

  def execute_choice(user_con_profile, constraints, choice, allow_waitlist: false)
    conflicts = constraints.conflicting_signups_for_run(choice.target_run)
    if conflicts.any?
      log_skip_choice(
        user_con_profile: user_con_profile,
        reason: :conflict,
        signup_choice: choice,
        extra: {
          conflicts: conflicts
        }
      )
      return
    end

    run = choice.target_run
    bucket_finder =
      SignupBucketFinder.new(
        run.registration_policy,
        choice.requested_bucket_key,
        run.signups.counted.occupying_slot.to_a
      )
    actual_bucket = bucket_finder.find_bucket
    if actual_bucket
      result =
        AcceptSignupChoiceService.new(
          signup_choice: choice,
          whodunit: whodunit,
          skip_locking: skip_locking,
          suppress_notifications: suppress_notifications
        ).call!
      choice.update!(state: "signed_up")
      log_signup(user_con_profile: user_con_profile, signup_choice: choice, signup: result.signup)
      result.signup
    elsif allow_waitlist
      result =
        AcceptSignupChoiceService.new(
          signup_choice: choice,
          whodunit: whodunit,
          skip_locking: skip_locking,
          suppress_notifications: suppress_notifications
        ).call!
      choice.update!(state: "waitlisted")
      log_waitlist(user_con_profile: user_con_profile, signup_choice: choice, signup: result.signup)
      result.signup
    else
      choice.update!(state: "skipped")
      log_skip_choice(user_con_profile: user_con_profile, reason: :full, signup_choice: choice)
      nil
    end
  end

  def log_decision(**args)
    decisions << RankedChoiceDecision.new(**args)
  end

  def log_skip_user(**args)
    log_decision(decision: :skip_user, **args)
  end

  def log_skip_choice(**args)
    log_decision(decision: :skip_choice, **args)
  end

  def log_signup(**args)
    log_decision(decision: :signup, **args)
  end

  def log_waitlist(**args)
    log_decision(decision: :waitlist, **args)
  end
end
