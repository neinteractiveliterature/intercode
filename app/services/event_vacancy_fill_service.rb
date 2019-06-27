class EventVacancyFillService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :move_results
  end
  self.result_class = Result

  attr_reader :run, :bucket_key, :move_results, :suppress_notifications
  delegate :event, to: :run
  delegate :convention, to: :event

  include Concerns::SkippableAdvisoryLock
  include Concerns::ConventionRegistrationFreeze

  def initialize(run, bucket_key, skip_locking: false, suppress_notifications: false)
    @run = run
    @bucket_key = bucket_key
    @skip_locking = skip_locking
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
      next if move_results.any? { |result| result.signup_id == signup.id }
      signup.bucket_key != bucket.key && signup_can_fill_bucket_vacancy?(signup, bucket)
    end
  end

  def signup_can_fill_bucket_vacancy?(signup, bucket)
    return false if signup.bucket&.not_counted? || signup.bucket&.slots_unlimited?

    (
      (signup.requested_bucket_key.nil? && bucket.slots_limited?) ||
      signup.requested_bucket_key == bucket.key ||
      bucket.anything?
    )
  end

  def signups_ordered
    @signups_ordered ||= begin
      run.signups.reload
      run.signups.where.not(state: 'withdrawn').where.not(id: team_member_signups.map(&:id)).to_a.sort_by do |signup|
        [
          # try not to move signups that are in the bucket they wanted
          (signup.bucket_key == signup.requested_bucket_key && signup.confirmed?) ? 1 : 0,
          # don't move confirmed no-preference signups unless necessary
          (signup.requested_bucket_key.nil? && signup.confirmed?) ? 1 : 0,
          signup.created_at
        ]
      end
    end
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
