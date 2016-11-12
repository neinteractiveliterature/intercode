class EventSignupService
  attr_reader :user_con_profile, :run, :requested_bucket_key, :prioritized_buckets

  def initialize(user_con_profile, run, requested_bucket_key)
    @user_con_profile = user_con_profile
    @run = run
    @requested_bucket_key = requested_bucket_key
  end

  def call
    return failure unless signup_count_allowed?(user_signup_count + 1)

    if !event.can_play_concurrently? && concurrent_signup?
      return failure
    end

    #signup_user_for_event
    signup = run.signups.create!(
      run: run,
      bucket_key: actual_bucket_key,
      user_con_profile: user_con_profile,
      counted: counts_towards_total?,
      state: signup_state
    )
    withdraw_user_from_conflicting_waitlist_signups # TODO: maybe, and with confirmation

    notify_team_members

    signup
  end

  private

  def counts_towards_total?
    is_team_member?
  end

  def signup_state
    signups = run.signups

    if !is_team_member? && prioritized_buckets.all? { |bucket| bucket.full?(signups) }
      'waitlisted'
    else
      'confirmed'
    end
  end

  def other_signups
    @other_signups ||= user_con_profile.signups.includes(run: :event).where.not(run_id: run.id).to_a
  end

  def prioritized_buckets
    @prioritized_buckets ||= [
      run.bucket_with_key(requested_bucket_key),
      run.registration_policy.anything_bucket
    ].compact
  end

  def actual_bucket_key
    signups = run.signups
    prioritized_buckets.find { |bucket| !bucket.full?(signups) }
  end

  def user_signup_count
    other_signups.size
  end

  def is_team_member?
    return @is_team_member unless @is_team_member.nil?
    @is_team_member = event.team_members.where(user_con_profile_id: user_con_profile.id).any?
  end

  def event
    @event ||= run.event
  end

  def convention
    @convention ||= event.convention
  end

  def signup_count_allowed?(signup_count)
    current_max = convention.maximum_event_signups.value_at(Time.now)

    case current_max
    when 'unlimited' then true
    when Numeric then signup_count <= current_max
    else false
    end
  end

  def concurrent_signup?
    other_signups.any? do |signup|
      other_run = signup.run
      !other_run.event.can_play_concurrently? && run.overlaps?(other_run)
    end
  end

  def withdraw_user_from_conflicting_waitlist_signups
    conflicting_waitlist_signups = other_signups.select { |signup| signup.waitlisted? && run.overlaps?(signup.run) }
    # TODO: do the withdraw
  end

  def notify_team_members
    # TODO: do the notification
  end
end