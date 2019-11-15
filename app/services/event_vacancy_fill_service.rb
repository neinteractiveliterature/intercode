class EventVacancyFillService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :move_results
  end
  self.result_class = Result

  attr_reader :run, :bucket_key, :move_results, :suppress_notifications, :immovable_signups
  delegate :event, to: :run
  delegate :convention, to: :event

  include SkippableAdvisoryLock
  include ConventionRegistrationFreeze

  def initialize(run, bucket_key, immovable_signups: [], skip_locking: false, suppress_notifications: false)
    @run = run
    @bucket_key = bucket_key
    @skip_locking = skip_locking
    @immovable_signups = immovable_signups
    @move_results = []
    @suppress_notifications = suppress_notifications
  end

  private

  def inner_call
    bucket = event.registration_policy.bucket_with_key(bucket_key)
    return success(move_results: []) if bucket.slots_unlimited?

    with_advisory_lock_unless_skip_locking("run_#{run.id}_signups") do
      fill_bucket_vacancy(bucket_key)
    end

    move_results.each do |result|
      notify_moved_signup(result) if result.should_notify?
    end

    success(move_results: move_results)
  end

  def fill_bucket_vacancy(bucket_key)
    signup_to_move = best_signup_to_fill_bucket_vacancy(bucket_key)
    return unless signup_to_move

    bucket = event.registration_policy.bucket_with_key(bucket_key)
    moving_confirmed_signup = signup_to_move.confirmed?
    prev_bucket_key = signup_to_move.bucket_key
    prev_state = signup_to_move.state
    signup_to_move.update!(state: 'confirmed', bucket_key: bucket_key, counted: bucket.counted?)
    move_results << SignupMoveResult.from_signup(signup_to_move, prev_state, prev_bucket_key)

    # We left a vacancy by moving a confirmed signup out of its bucket, so recursively try to fill
    # that vacancy
    fill_bucket_vacancy(prev_bucket_key) if moving_confirmed_signup
  end

  def best_signup_to_fill_bucket_vacancy(bucket_key)
    bucket = event.registration_policy.bucket_with_key(bucket_key)
    signups_ordered.find do |signup|
      next if signup.bucket_key == bucket.key
      next unless signup_can_fill_bucket_vacancy?(signup, bucket)

      # don't move signups that are already in their best possible spot
      next if signup.confirmed? && signup.requested_bucket_key == signup.bucket_key

      signup
    end
  end

  def signup_can_fill_bucket_vacancy?(signup, bucket)
    return false if signup.bucket&.not_counted? || signup.bucket&.slots_unlimited?

    (
      (signup.no_preference? && bucket.slots_limited? && bucket.counted?) ||
      signup.requested_bucket_key == bucket.key ||
      bucket.anything?
    )
  end

  def signups_ordered
    @signups_ordered ||= begin
      movable_signups.to_a.sort_by do |signup|
        signup_priority_key(signup)
      end
    end
  end

  def movable_signups
    @movable_signups ||= begin
      run.signups.reload
      all_signups = run.signups.where.not(state: 'withdrawn')
        .where.not(id: team_member_signups.map(&:id))

      all_signups.select { |signup| signup_movable?(signup) }
    end
  end

  def signup_movable?(signup)
    return false if immovable_signups.include?(signup)
    return false if move_results.any? { |result| result.signup_id == signup.id }
    true
  end

  def signup_priority_key(signup)
    [
      # Move waitlisted signups first
      signup.confirmed? ? 1 : 0,
      # don't move confirmed no-preference signups unless necessary
      (signup.no_preference? && signup.confirmed?) ? 1 : 0,
      # When moving confirmed signups, try to keep the earlier signups stable
      signup.created_at.to_i * (signup.confirmed? ? -1 : 1)
    ]
  end

  def team_member_signups
    @team_member_signups ||= run.signups.reload.where(
      user_con_profile_id: TeamMember.where(event_id: run.event_id).select(:user_con_profile_id)
    ).to_a
  end

  def notify_moved_signup(result)
    return if suppress_notifications

    # Wait 30 seconds because the transaction hasn't been committed yet
    EventSignupMailer.user_signup_moved(result.to_h).deliver_later(wait: 30.seconds)
  end
end
