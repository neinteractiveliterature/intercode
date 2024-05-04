class ExecuteRankedChoiceSignupService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :decision
  end
  self.result_class = Result

  attr_reader :whodunit,
              :signup_ranked_choice,
              :constraints,
              :skip_locking,
              :suppress_notifications,
              :decisions,
              :allow_waitlist
  delegate :user_con_profile, to: :signup_ranked_choice
  delegate :convention, to: :user_con_profile

  def initialize(
    whodunit:,
    signup_ranked_choice:,
    allow_waitlist: false,
    constraints: nil,
    skip_locking: false,
    suppress_notifications: false
  )
    @whodunit = whodunit
    @signup_ranked_choice = signup_ranked_choice
    @allow_waitlist = allow_waitlist
    @constraints = constraints || UserSignupConstraints.new(user_con_profile)
    @skip_locking = skip_locking
    @suppress_notifications = suppress_notifications
  end

  def inner_call
    conflicts = constraints.conflicting_signups_for_run(signup_ranked_choice.target_run)
    if conflicts.any?
      decision = do_skip_choice(:conflict, { conflicting_signup_ids: conflicts.map(&:id) })
      return success(decision:)
    end

    actual_bucket = find_bucket
    decision = execute_choice(actual_bucket)
    success(decision:)
  end

  private

  def find_bucket
    run = signup_ranked_choice.target_run
    existing_signups = run.signups.counted.occupying_slot.to_a
    existing_signups += run.signup_requests.where(state: "pending").to_a if convention.signup_mode == "moderated"
    bucket_finder =
      SignupBucketFinder.new(run.registration_policy, signup_ranked_choice.requested_bucket_key, existing_signups)
    bucket_finder.find_bucket
  end

  def execute_choice(actual_bucket)
    if actual_bucket
      do_signup
    elsif allow_waitlist
      do_waitlist
    else
      do_skip_choice(:full)
    end
  end

  def do_skip_choice(reason, extra = nil)
    RankedChoiceDecision.create!(decision: :skip_choice, user_con_profile:, reason:, signup_ranked_choice:, extra:)
  end

  def do_signup
    result =
      AcceptSignupRankedChoiceService.new(
        signup_ranked_choice:,
        whodunit:,
        skip_locking:,
        suppress_notifications:
      ).call!
    RankedChoiceDecision.create!(
      decision: :signup,
      user_con_profile:,
      signup_ranked_choice:,
      signup: result.signup,
      signup_request: result.signup_request
    )
  end

  def do_waitlist
    result =
      AcceptSignupRankedChoiceService.new(
        signup_ranked_choice:,
        whodunit:,
        skip_locking:,
        suppress_notifications:
      ).call!
    RankedChoiceDecision.create!(
      decision: :waitlist,
      user_con_profile:,
      signup_ranked_choice:,
      signup: result.signup,
      signup_request: result.signup_request
    )
  end
end
