class EventSignupService
  class Result
    attr_reader :signup, :error

    def self.success(signup)
      new(true, signup, nil)
    end

    def self.failure(error)
      new(false, nil, error)
    end

    def initialize(success, signup, error)
      @success = success
      @signup = signup
      @error = error
    end

    def success?
      @success
    end
  end

  attr_reader :user_con_profile, :run, :requested_bucket_key, :prioritized_buckets, :max_signups_allowed

  def initialize(user_con_profile, run, requested_bucket_key)
    @user_con_profile = user_con_profile
    @run = run
    @requested_bucket_key = requested_bucket_key

    @max_signups_allowed = convention.maximum_event_signups.value_at(Time.now)
  end

  def call
    unless signup_count_allowed?(user_signup_count + 1)
      return Result.failure("You are already signed up for #{user_signup_count} events, which is the maximum allowed at this time.")
    end

    if !event.can_play_concurrently? && concurrent_signups.any?
      event_titles = concurrent_signups.map { |signup| signup.event.title }
      verb = (event_titles.size > 1) ? 'conflict' : 'conflicts'
      return Result.failure("You are already signed up for #{event_titles.to_sentence}, which #{verb} with #{event.title}.")
    end

    signup = run.signups.create!(
      run: run,
      bucket_key: actual_bucket.try!(:key),
      requested_bucket_key: requested_bucket_key,
      user_con_profile: user_con_profile,
      counted: counts_towards_total?,
      state: signup_state
    )
    withdraw_user_from_conflicting_waitlist_signups # TODO: maybe, and with confirmation

    notify_team_members(signup)

    Result.success(signup)
  end

  private

  def counts_towards_total?
    !is_team_member?
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

  def actual_bucket
    @actual_bucket ||= begin
      signups = run.signups
      prioritized_buckets.find { |bucket| !bucket.full?(signups) }
    end
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
    case max_signups_allowed
    when 'unlimited' then true
    when Numeric then signup_count <= current_max
    else false
    end
  end

  def concurrent_signups
    @concurrent_signups ||= other_signups.select do |signup|
      other_run = signup.run
      signup.confirmed? && !other_run.event.can_play_concurrently? && run.overlaps?(other_run)
    end
  end

  def withdraw_user_from_conflicting_waitlist_signups
    conflicting_waitlist_signups = other_signups.select { |signup| signup.waitlisted? && run.overlaps?(signup.run) }
    # TODO: do the withdraw
  end

  def notify_team_members(signup)
    event.team_members.where(receive_signup_email: true).find_each do |team_member|
      EventSignupMailer.new_signup(signup, team_member).deliver_later
    end
  end
end