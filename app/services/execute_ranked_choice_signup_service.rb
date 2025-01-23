class ExecuteRankedChoiceSignupService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :decision
  end
  self.result_class = Result

  class SkipReason
    attr_reader :reason, :extra

    def initialize(reason, **extra)
      @reason = reason
      @extra = extra
    end
  end

  attr_reader :signup_round,
              :whodunit,
              :signup_ranked_choice,
              :constraints,
              :skip_locking,
              :suppress_notifications,
              :decisions,
              :allow_waitlist
  delegate :user_con_profile, to: :signup_ranked_choice
  delegate :convention, to: :user_con_profile

  def initialize(
    signup_round:,
    whodunit:,
    signup_ranked_choice:,
    allow_waitlist: false,
    constraints: nil,
    skip_locking: false,
    suppress_notifications: false
  )
    @signup_round = signup_round
    @whodunit = whodunit
    @signup_ranked_choice = signup_ranked_choice
    @allow_waitlist = allow_waitlist
    @constraints = constraints || UserSignupConstraints.new(user_con_profile)
    @skip_locking = skip_locking
    @suppress_notifications = suppress_notifications
  end

  def inner_call
    skip = skip_reason

    decision = if skip
      do_skip_choice(skip.reason, skip.extra)
    elsif actual_bucket
      do_signup
    else
      do_waitlist
    end

    success(decision:)
  end

  def skip_reason
    conflicts = constraints.conflicting_signups_for_run(signup_ranked_choice.target_run)
    return SkipReason.new(:conflict, conflicting_signup_ids: conflicts.map(&:id)) if conflicts.any?

    violated_constraints =
      constraints.ranked_choice_user_constraints_at_maximum(signup_ranked_choice.target_run.timespan)
    if violated_constraints.any?
      return(
        SkipReason.new(
          :ranked_choice_user_constraints,
          ranked_choice_user_constraint_ids: violated_constraints.map(&:id)
        )
      )
    end

    if !actual_bucket && !allow_waitlist
      return SkipReason.new(:full)
    end

    nil
  end

  private

  def actual_bucket
    @actual_bucket ||= begin
      run = signup_ranked_choice.target_run
      existing_signups = run.signups.counted.occupying_slot.to_a
      bucket_finder =
        SignupBucketFinder.new(run.registration_policy, signup_ranked_choice.requested_bucket_key, existing_signups)
      if convention.signup_mode == "moderated"
        run
          .signup_requests
          .where(state: "pending")
          .find_each { |request| bucket_finder.simulate_accepting_signup_request(request) }
      end

      bucket_finder.find_bucket
    end
  end

  def do_skip_choice(reason, extra = nil)
    RankedChoiceDecision.create!(
      signup_round:,
      decision: :skip_choice,
      user_con_profile:,
      reason:,
      signup_ranked_choice:,
      after_signup_ranked_choice:,
      extra:
    )
  end

  def do_signup
    result =
      AcceptSignupRankedChoiceService.new(
        signup_ranked_choice:,
        whodunit:,
        skip_locking: true,
        suppress_notifications:
      ).call!
    RankedChoiceDecision.create!(
      signup_round:,
      decision: :signup,
      user_con_profile:,
      signup_ranked_choice:,
      after_signup_ranked_choice:,
      signup: result.signup,
      signup_request: result.signup_request
    )
  end

  def do_waitlist
    result =
      AcceptSignupRankedChoiceService.new(
        signup_ranked_choice:,
        whodunit:,
        skip_locking: true,
        suppress_notifications:
      ).call!
    RankedChoiceDecision.create!(
      signup_round:,
      decision: :waitlist,
      user_con_profile:,
      signup_ranked_choice:,
      after_signup_ranked_choice:,
      signup: result.signup,
      signup_request: result.signup_request
    )
  end

  def after_signup_ranked_choice
    @after_signup_ranked_choice ||=
      user_con_profile.signup_ranked_choices.where("priority > ?", signup_ranked_choice.priority).order(:priority).first
  end
end
