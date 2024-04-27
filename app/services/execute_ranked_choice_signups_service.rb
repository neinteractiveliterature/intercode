# frozen_string_literal: true
class ExecuteRankedChoiceSignupsService < CivilService::Service
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
    return if check_skip_user_for_policy_reasons(constraints)

    pending_choices = user_con_profile.signup_ranked_choices.where(state: "pending").order(:priority).to_a
    unless pending_choices.any?
      decisions << RankedChoiceDecision.create!(
        decision: :skip_user,
        user_con_profile: user_con_profile,
        reason: :no_pending_choices
      )
      return
    end

    signup = pending_choices.find { |choice| execute_choice(constraints, choice) }
    signup || pending_choices.find { |choice| execute_choice(constraints, choice, allow_waitlist: true) }
  end

  def check_skip_user_for_policy_reasons(constraints)
    unless constraints.has_ticket_if_required?
      decisions << RankedChoiceDecision.create!(
        decision: :skip_user,
        user_con_profile: user_con_profile,
        reason: :missing_ticket
      )
      return true
    end

    unless constraints.signup_count_allowed?(constraints.current_signup_count + 1)
      decisions << RankedChoiceDecision.create!(
        decision: :skip_user,
        user_con_profile: user_con_profile,
        reason: :no_more_signups_allowed
      )
      return true
    end

    false
  end

  def execute_choice(constraints, choice, allow_waitlist: false)
    result =
      ExecuteRankedChoiceSignupService.call!(
        whodunit: whodunit,
        signup_ranked_choice: choice,
        allow_waitlist: allow_waitlist,
        constraints: constraints,
        skip_locking: skip_locking,
        suppress_notifications: suppress_notifications
      )
    decisions << result.decision
    result.decision.decision != "skip_choice"
  end
end
