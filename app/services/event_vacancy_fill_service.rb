# frozen_string_literal: true
class EventVacancyFillService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :move_results
  end
  self.result_class = Result

  attr_reader :run, :bucket_key, :move_results, :suppress_notifications, :immovable_signups, :action
  delegate :event, to: :run
  delegate :convention, to: :event

  include SkippableAdvisoryLock
  include ConventionRegistrationFreeze

  def initialize(
    run,
    bucket_key,
    immovable_signups: [],
    skip_locking: false,
    suppress_notifications: false,
    action: "vacancy_fill"
  )
    @run = run
    @bucket_key = bucket_key
    @skip_locking = skip_locking
    @immovable_signups = immovable_signups
    @move_results = []
    @suppress_notifications = suppress_notifications
    @action = action
  end

  private

  def inner_call
    bucket = event.registration_policy.bucket_with_key(bucket_key)
    return success(move_results: []) if bucket.slots_unlimited?

    with_advisory_lock_unless_skip_locking("run_#{run.id}_signups") { fill_bucket_vacancy(bucket_key) }

    move_results.each { |result| notify_moved_signup(result) if result.should_notify? }

    success(move_results: move_results)
  end

  def fill_bucket_vacancy(bucket_key)
    signup_to_move = best_signup_to_fill_bucket_vacancy(bucket_key)
    return unless signup_to_move

    bucket = event.registration_policy.bucket_with_key(bucket_key)
    creating_vacancy = signup_to_move.occupying_slot?
    prev_bucket_key = signup_to_move.bucket_key
    prev_state = signup_to_move.state
    signup_to_move.update!(
      bucket_key: bucket_key,
      counted: bucket.counted?,
      **status_attributes_for_newly_moved_signup(signup_to_move)
    )
    signup_to_move.log_signup_change!(action: "vacancy_fill")
    move_results << SignupMoveResult.from_signup(signup_to_move, prev_state, prev_bucket_key)

    # We left a vacancy by moving a confirmed signup out of its bucket, so recursively try to fill
    # that vacancy
    fill_bucket_vacancy(prev_bucket_key) if creating_vacancy
  end

  def status_attributes_for_newly_moved_signup(signup_to_move)
    new_state =
      if convention.ticket_mode == "ticket_per_event" &&
           event.tickets.where(user_con_profile_id: signup_to_move.user_con_profile_id).none?
        "ticket_purchase_hold"
      else
        "confirmed"
      end
    new_expires_at = new_state == "ticket_purchase_hold" ? 2.days.from_now : signup_to_move.expires_at

    { state: new_state, expires_at: new_expires_at }
  end

  def best_signup_to_fill_bucket_vacancy(bucket_key)
    bucket = event.registration_policy.bucket_with_key(bucket_key)
    return unless bucket

    signups_ordered.find do |signup|
      next if signup.bucket_key == bucket.key
      next unless signup_can_fill_bucket_vacancy?(signup, bucket)
      next if signup_already_in_best_slot?(signup)

      signup
    end
  end

  def signup_already_in_best_slot?(signup)
    return false unless signup.occupying_slot?

    (signup.requested_bucket_key == signup.bucket_key)
    # TODO: figure out how to do something like the next line.  We'd rather not move a no-pref
    # signup out of flex but at this point I am not sure how to do that while allowing it to be
    # moved at all.
    #  || (signup.no_preference? && signup.anything? && move_results.empty?)
  end

  def signup_can_fill_bucket_vacancy?(signup, bucket_with_vacancy)
    return false unless signup.bucket.nil? || counted_limited_bucket?(signup.bucket)

    (signup.no_preference? && counted_limited_bucket?(bucket_with_vacancy)) ||
      signup.requested_bucket_key == bucket_with_vacancy.key || bucket_with_vacancy.anything?
  end

  def counted_limited_bucket?(bucket)
    bucket&.slots_limited? && bucket.counted?
  end

  def all_signups_ordered
    @all_signups_ordered ||= all_signups.sort_by { |signup| signup_priority_key(signup) }
  end

  def all_signups
    @all_signups ||=
      begin
        run.signups.reload
        run.signups.where.not(state: "withdrawn").where.not(id: team_member_signups.map(&:id)).to_a
      end
  end

  def signups_ordered
    all_signups_ordered.select { |signup| signup_movable?(signup) }
  end

  def signup_movable?(signup)
    return false if immovable_signups.include?(signup)
    if signup.no_preference? && signup.state == "confirmed" && event.registration_policy.freeze_no_preference_buckets?
      return false
    end
    return false if move_results.any? { |result| result.signup_id == signup.id }
    true
  end

  def signup_priority_key(signup)
    [
      # Move waitlisted signups first
      signup.occupying_slot? ? 1 : 0,
      # don't move confirmed or held no-preference signups unless necessary
      signup.no_preference? && signup.occupying_slot? ? 1 : 0,
      # When moving confirmed signups, try to keep the earlier signups stable
      signup.created_at.to_f * (signup.occupying_slot? ? -1 : 1)
    ]
  end

  def team_member_signups
    @team_member_signups ||=
      run
        .signups
        .reload
        .where(user_con_profile_id: TeamMember.where(event_id: run.event_id).select(:user_con_profile_id))
        .to_a
  end

  def notify_moved_signup(result)
    return if suppress_notifications

    # Wait 30 seconds because the transaction hasn't been committed yet
    Signups::UserSignupMovedNotifier.new(move_result: result).deliver_later(wait: 5.seconds)
  end
end
