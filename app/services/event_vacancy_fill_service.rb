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

    # Clear cached signup data since we just modified it
    clear_signup_cache!

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

    bucket_has_vacancy = run.bucket_has_available_slots?(bucket_key)
    waitlisted_signups = signups_ordered.reject(&:occupying_slot?)

    # Try to accommodate each waitlisted signup in order
    waitlisted_signups.each do |waitlisted_signup|
      result = try_accommodate_waitlisted_signup(waitlisted_signup, bucket, bucket_key, bucket_has_vacancy)
      return result if result
    end

    # Fallback: if no waitlisted signup can be accommodated, look at confirmed signups
    find_confirmed_signup_to_move(bucket, bucket_key, bucket_has_vacancy)
  end

  def try_accommodate_waitlisted_signup(waitlisted_signup, bucket, bucket_key, bucket_has_vacancy)
    # Can they fill this bucket directly?
    return waitlisted_signup if can_fill_bucket_directly?(waitlisted_signup, bucket, bucket_key, bucket_has_vacancy)

    # Do they want a different specific bucket? Try to make room for them there.
    result = try_make_room_in_requested_bucket(waitlisted_signup, bucket, bucket_key, bucket_has_vacancy)
    return result if result

    # If this bucket is full but the waitlisted signup wants THIS bucket, make room
    try_make_room_for_waitlisted_signup(waitlisted_signup, bucket, bucket_key, bucket_has_vacancy)
  end

  def can_fill_bucket_directly?(waitlisted_signup, bucket, bucket_key, bucket_has_vacancy)
    waitlisted_signup.bucket_key != bucket_key && signup_can_fill_bucket_vacancy?(waitlisted_signup, bucket) &&
      !signup_already_in_best_slot?(waitlisted_signup) && (bucket_has_vacancy || bucket.anything?)
  end

  def try_make_room_in_requested_bucket(waitlisted_signup, bucket, bucket_key, bucket_has_vacancy)
    unless waitlisted_signup.requested_bucket_key && waitlisted_signup.requested_bucket_key != bucket_key &&
             bucket_has_vacancy
      return
    end

    requested_bucket = event.registration_policy.bucket_with_key(waitlisted_signup.requested_bucket_key)
    return unless requested_bucket && counted_limited_bucket?(requested_bucket)

    find_movable_no_pref_signup(requested_bucket.key, bucket)
  end

  def try_make_room_for_waitlisted_signup(waitlisted_signup, bucket, bucket_key, bucket_has_vacancy)
    if bucket_has_vacancy || waitlisted_signup.requested_bucket_key != bucket_key || !counted_limited_bucket?(bucket) ||
         bucket.anything?
      return
    end

    alternate_bucket = find_alternate_bucket_with_vacancy
    return unless alternate_bucket

    no_pref_to_move = find_movable_no_pref_signup(bucket_key, alternate_bucket)
    return unless no_pref_to_move

    # Fill the alternate bucket with the no-pref signup, which will create a vacancy here
    fill_bucket_vacancy(alternate_bucket.key)
    # After filling the alternate bucket, try again to fill this bucket
    best_signup_to_fill_bucket_vacancy(bucket_key)
  end

  def find_confirmed_signup_to_move(bucket, _bucket_key, bucket_has_vacancy)
    signups_ordered.find do |signup|
      next if signup.bucket_key == bucket.key
      next unless signup_can_fill_bucket_vacancy?(signup, bucket)
      next if signup_already_in_best_slot?(signup)
      next unless bucket_has_vacancy || bucket.anything?

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

  def find_movable_no_pref_signup(from_bucket_key, to_bucket)
    signups_ordered.find do |signup|
      signup.bucket_key == from_bucket_key && signup.no_preference? && signup.occupying_slot? &&
        signup_movable?(signup) && signup_can_fill_bucket_vacancy?(signup, to_bucket) &&
        !signup_already_in_best_slot?(signup)
    end
  end

  def find_alternate_bucket_with_vacancy
    event.registration_policy.buckets.find do |bucket|
      counted_limited_bucket?(bucket) && run.bucket_has_available_slots?(bucket.key)
    end
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

  def clear_signup_cache!
    @all_signups = nil
    @all_signups_ordered = nil
    run.signups.reload
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
