# frozen_string_literal: true
class EventSignupService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :signup
  end
  self.result_class = Result

  attr_reader :user_con_profile,
              :run,
              :requested_bucket_key,
              :whodunit,
              :suppress_notifications,
              :suppress_confirmation,
              :allow_non_self_service_signups,
              :action
  delegate :event, to: :run
  delegate :convention, to: :event

  self.validate_manually = true
  validate :signup_count_must_be_allowed
  validate :convention_must_allow_self_service_signups
  validate :must_not_already_be_signed_up
  validate :must_not_have_conflicting_signups
  validate :must_have_ticket_if_required
  validate :require_valid_bucket, unless: :team_member?
  validate :require_no_bucket_for_team_member

  include SkippableAdvisoryLock
  include ConventionRegistrationFreeze

  def initialize( # rubocop:disable Metrics/ParameterLists
    user_con_profile,
    run,
    requested_bucket_key,
    whodunit,
    skip_locking: false,
    suppress_notifications: false,
    suppress_confirmation: false,
    allow_non_self_service_signups: false,
    action: "self_service_signup"
  )
    @user_con_profile = user_con_profile
    @run = run
    @requested_bucket_key = requested_bucket_key
    @whodunit = whodunit
    @skip_locking = skip_locking
    @suppress_notifications = suppress_notifications
    @suppress_confirmation = suppress_confirmation
    @allow_non_self_service_signups = allow_non_self_service_signups
    @action = action
  end

  private

  def inner_call # rubocop:disable Metrics/AbcSize
    signup = nil
    with_advisory_lock_unless_skip_locking("run_#{run.id}_signups") do
      return failure(errors) unless valid?

      move_signup if actual_bucket&.full?(run.signups)

      signup =
        run.signups.create!(
          run: run,
          bucket_key: actual_bucket&.key,
          requested_bucket_key: requested_bucket_key,
          user_con_profile: user_con_profile,
          counted: counts_towards_total?,
          state: signup_state,
          expires_at: signup_state == "ticket_purchase_hold" ? 30.minutes.from_now : nil,
          updated_by: whodunit
        )

      signup.log_signup_change!(action: action)
    end

    notify_team_members(signup)
    send_confirmation(signup)
    success(signup: signup)
  end

  def convention_must_allow_self_service_signups
    return if allow_non_self_service_signups
    return if convention.signup_mode == "self_service"
    return if team_member?

    errors.add :base, "#{convention.name} does not allow self-service signups."
  end

  def user_signup_constraints
    @user_signup_constraints ||= UserSignupConstraints.new(user_con_profile)
  end

  def signup_count_must_be_allowed
    return unless signup_count_check_required?

    case user_signup_constraints.max_signups_allowed
    when "not_now"
      nil # ConventionRegistrationFreeze will take care of this
    when "not_yet"
      errors.add :base, "Signups are not allowed at this time."
    else
      user_signup_count = user_signup_constraints.current_signup_count
      unless user_signup_constraints.signup_count_allowed?(user_signup_count + 1)
        errors.add :base,
                   "You are already signed up for #{user_signup_count} \
#{"event".pluralize(user_signup_count)}, which is the maximum allowed at this time."
      end
    end
  end

  def signup_count_check_required?
    return false if team_member?
    return false if Signup::SLOT_OCCUPYING_STATES.include?(signup_state) && !counts_towards_total?

    true
  end

  def conflicting_signups
    @conflicting_signups ||= user_signup_constraints.conflicting_signups_for_run(run, allow_team_member: team_member?)
  end

  def must_not_have_conflicting_signups
    return unless !event.can_play_concurrently? && conflicting_signups.any?

    verb = conflicting_signups.size > 1 ? "conflict" : "conflicts"
    errors.add :base, "You are already #{conflict_descriptions}, which #{verb} with #{event.title}."
  end

  def conflict_descriptions
    confirmed_titles = conflicting_signups.select(&:confirmed?).map { |signup| signup.event.title }
    ticket_purchase_hold_titles =
      conflicting_signups.select(&:ticket_purchase_hold?).map { |signup| signup.event.title }
    waitlisted_titles = conflicting_signups.select(&:waitlisted?).map { |signup| signup.event.title }
    [
      confirmed_titles.any? ? "signed up for #{confirmed_titles.to_sentence}" : nil,
      ticket_purchase_hold_titles.any? ? "holding a spot for #{ticket_purchase_hold_titles.to_sentence}" : nil,
      waitlisted_titles.any? ? "waitlisted for #{waitlisted_titles.to_sentence}" : nil
    ].compact.join(" and ")
  end

  def must_have_ticket_if_required
    return if user_signup_constraints.has_ticket_if_required?

    if user_con_profile.ticket
      errors.add :base,
                 "You have a #{user_con_profile.ticket.ticket_type.description}, \
but these do not allow event signups.  If you want to sign up for events, please contact \
#{convention.name} staff."
    else
      errors.add :base,
                 "You must have a valid #{convention.ticket_name} to #{convention.name} to \
sign up for events."
    end
  end

  def must_not_already_be_signed_up
    already_signed_up =
      existing_signups.reject(&:withdrawn?).any? { |signup| signup.user_con_profile_id == user_con_profile.id }

    return unless already_signed_up

    errors.add :base, "You are already signed up for this run of #{event.title}."
  end

  def require_valid_bucket
    return if run.registration_policy.allow_no_preference_signups? && !requested_bucket_key

    requested_bucket = run.registration_policy.bucket_with_key(requested_bucket_key)
    return if requested_bucket && !requested_bucket.anything?

    non_anything_buckets = run.registration_policy.buckets.reject(&:anything?)
    errors.add :base, "Please choose one of the following buckets: #{non_anything_buckets.map(&:name).join(", ")}."
  end

  def require_no_bucket_for_team_member
    return unless team_member?
    return unless requested_bucket_key

    errors.add :base, "Team members must sign up as non-counted"
  end

  def counts_towards_total?
    !team_member? && actual_bucket&.counted?
  end

  def signup_state
    if !team_member? && !actual_bucket
      "waitlisted"
    elsif convention.ticket_mode == "ticket_per_event" &&
          run.tickets.where(user_con_profile_id: user_con_profile.id).none?
      "ticket_purchase_hold"
    else
      "confirmed"
    end
  end

  def bucket_finder
    @bucket_finder ||=
      SignupBucketFinder.new(run.registration_policy, requested_bucket_key, run.signups.counted.occupying_slot.to_a)
  end

  def actual_bucket
    return nil if team_member?
    @actual_bucket ||= bucket_finder.find_bucket
  end

  def team_member?
    return @is_team_member unless @is_team_member.nil?
    @is_team_member = event.team_members.where(user_con_profile_id: user_con_profile.id).any?
  end

  def existing_signups
    @existing_signups ||= run.signups
  end

  def existing_signups_by_bucket_key
    @existing_signups_by_bucket_key ||= existing_signups.group_by(&:bucket_key)
  end

  def move_signup
    movable_signup = bucket_finder.movable_signups_for_bucket(actual_bucket).first

    destination_bucket =
      bucket_finder.no_preference_bucket_finder.prioritized_buckets_with_capacity_except(actual_bucket).first

    movable_signup.update!(bucket_key: destination_bucket.key)
    movable_signup
  end

  def notify_team_members(signup)
    return if suppress_notifications

    # Wait 5 seconds because the transaction hasn't been committed yet
    Signups::NewSignupNotifier.new(signup: signup).deliver_later(wait: 5.seconds)
  end

  def send_confirmation(signup)
    return if suppress_confirmation

    # Wait 5 seconds because the transaction hasn't been committed yet
    Signups::SignupConfirmationNotifier.new(signup: signup).deliver_later(wait: 5.seconds)
  end
end
