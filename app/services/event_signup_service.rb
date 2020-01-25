class EventSignupService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :signup
  end
  self.result_class = Result

  attr_reader :user_con_profile, :run, :requested_bucket_key, :max_signups_allowed, :whodunit,
    :suppress_notifications, :allow_non_self_service_signups
  delegate :event, to: :run
  delegate :convention, to: :event

  self.validate_manually = true
  validate :signup_count_must_be_allowed
  validate :convention_must_allow_self_service_signups
  validate :must_not_already_be_signed_up
  validate :must_not_have_conflicting_signups
  validate :must_have_ticket_if_required
  validate :require_valid_bucket
  validate :require_no_bucket_for_team_member

  include SkippableAdvisoryLock
  include ConventionRegistrationFreeze

  def initialize(
    user_con_profile, run, requested_bucket_key, whodunit,
    skip_locking: false, suppress_notifications: false, allow_non_self_service_signups: false
  )
    @user_con_profile = user_con_profile
    @run = run
    @requested_bucket_key = requested_bucket_key
    @whodunit = whodunit
    @skip_locking = skip_locking
    @suppress_notifications = suppress_notifications
    @allow_non_self_service_signups = allow_non_self_service_signups
  end

  private

  def inner_call
    signup = nil
    with_advisory_lock_unless_skip_locking("run_#{run.id}_signups") do
      return failure(errors) unless valid?

      move_signup if actual_bucket && actual_bucket.full?(run.signups)

      signup = run.signups.create!(
        run: run,
        bucket_key: actual_bucket.try!(:key),
        requested_bucket_key: requested_bucket_key,
        user_con_profile: user_con_profile,
        counted: counts_towards_total?,
        state: signup_state,
        updated_by: whodunit
      )
    end

    notify_team_members(signup)
    success(signup: signup)
  end

  def convention_must_allow_self_service_signups
    return if allow_non_self_service_signups
    return if convention.signup_mode == 'self_service'
    return if team_member?

    errors.add :base, "#{convention.name} does not allow self-service signups."
  end

  def signup_count_must_be_allowed
    return if team_member?
    return if signup_state == 'confirmed' && !counts_towards_total?
    @max_signups_allowed = convention.maximum_event_signups.value_at(Time.now)

    case @max_signups_allowed
    when 'not_now' then return # ConventionRegistrationFreeze will take care of this
    when 'not_yet' then errors.add :base, 'Signups are not allowed at this time.'
    else
      unless signup_count_allowed?(user_signup_count + 1)
        errors.add :base,
          "You are already signed up for #{user_signup_count} \
#{'event'.pluralize(user_signup_count)}, which is the maximum allowed at this time."
      end
    end
  end

  def must_not_have_conflicting_signups
    return unless !event.can_play_concurrently? && concurrent_signups.any?
    confirmed_titles = concurrent_signups.select(&:confirmed?).map { |signup| signup.event.title }
    waitlisted_titles = concurrent_signups.select(&:waitlisted?).map { |signup| signup.event.title }
    conflict_descriptions = [
      confirmed_titles.any? ? "signed up for #{confirmed_titles.to_sentence}" : nil,
      waitlisted_titles.any? ? "waitlisted for #{waitlisted_titles.to_sentence}" : nil
    ].compact.join(' and ')
    verb = (concurrent_signups.size > 1) ? 'conflict' : 'conflicts'
    errors.add :base,
      "You are already #{conflict_descriptions}, which #{verb} \
with #{event.title}."
  end

  def must_have_ticket_if_required
    return unless convention.ticket_mode == 'required_for_signup'

    ticket = user_con_profile.ticket
    return if ticket&.allows_event_signups?

    if ticket
      errors.add :base, "You have a #{ticket.ticket_type.description}, \
but these do not allow event signups.  If you want to sign up for events, please contact \
#{convention.name} staff."
    else
      errors.add :base, "You must have a valid #{convention.ticket_name} to #{convention.name} to \
sign up for events."
    end
  end

  def must_not_already_be_signed_up
    already_signed_up = existing_signups.reject(&:withdrawn?).any? do |signup|
      signup.user_con_profile_id == user_con_profile.id
    end

    return unless already_signed_up

    errors.add :base, "You are already signed up for this run of #{event.title}."
  end

  def require_valid_bucket
    return if run.registration_policy.allow_no_preference_signups? && !requested_bucket_key
    return if team_member?

    requested_bucket = run.registration_policy.bucket_with_key(requested_bucket_key)
    return unless !requested_bucket || requested_bucket.anything?

    other_buckets = run.registration_policy.buckets.reject(&:anything?)
    errors.add :base,
      "Please choose one of the following buckets: #{other_buckets.map(&:name).join(', ')}."
  end

  def require_no_bucket_for_team_member
    return unless team_member?
    return unless requested_bucket_key

    errors.add :base, 'Team members must sign up as non-counted'
  end

  def counts_towards_total?
    !team_member? && actual_bucket&.counted?
  end

  def signup_state
    if !team_member? && !actual_bucket
      'waitlisted'
    else
      'confirmed'
    end
  end

  def other_signups_including_not_counted
    @other_signups_including_not_counted ||= user_con_profile.signups.includes(run: :event)
      .where.not(run_id: run.id).where.not(state: 'withdrawn').to_a
  end

  def other_signups
    @other_signups ||= other_signups_including_not_counted.select do |signup|
      signup.counted? || (signup.state == 'waitlisted' && !signup.requested_bucket&.not_counted?)
    end
  end

  def bucket_finder
    @bucket_finder ||= SignupBucketFinder.new(
      run.registration_policy,
      requested_bucket_key,
      run.signups.counted.confirmed.to_a
    )
  end

  def actual_bucket
    return nil if team_member?
    @actual_bucket ||= bucket_finder.find_bucket
  end

  def user_signup_count
    other_signups.size
  end

  def team_member?
    return @is_team_member unless @is_team_member.nil?
    @is_team_member = event.team_members.where(user_con_profile_id: user_con_profile.id).any?
  end

  def signup_count_allowed?(signup_count)
    case max_signups_allowed
    when 'unlimited' then true
    when 'not_yet' then false
    else
      signup_count <= max_signups_allowed.to_i
    end
  end

  def concurrent_signups
    @concurrent_signups ||= other_signups_including_not_counted.select do |signup|
      other_run = signup.run
      !other_run.event.can_play_concurrently? && run.overlaps?(other_run)
    end
  end

  def existing_signups
    @existing_signups ||= run.signups
  end

  def existing_signups_by_bucket_key
    @existing_signups_by_bucket_key ||= existing_signups.group_by(&:bucket_key)
  end

  def move_signup
    movable_signup = bucket_finder.movable_signups_for_bucket(actual_bucket).first

    destination_bucket = bucket_finder
      .no_preference_bucket_finder
      .prioritized_buckets_with_capacity_except(actual_bucket)
      .first

    movable_signup.update!(bucket_key: destination_bucket.key)
    movable_signup
  end

  def notify_team_members(signup)
    return if suppress_notifications

    # Wait 30 seconds because the transaction hasn't been committed yet
    Signups::NewSignupNotifier.new(signup: signup).deliver_later(wait: 5.seconds)
  end
end
