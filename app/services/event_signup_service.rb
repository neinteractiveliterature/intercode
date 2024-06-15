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
  validate :must_not_have_signup_rounds_due
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
          run:,
          bucket_key: actual_bucket&.key,
          requested_bucket_key:,
          user_con_profile:,
          counted: counts_towards_total?,
          state: signup_state,
          expires_at: signup_state == "ticket_purchase_hold" ? 30.minutes.from_now : nil,
          updated_by: whodunit
        )

      signup.log_signup_change!(action:)
    end

    notify_team_members(signup)
    send_confirmation(signup)
    success(signup:)
  end

  def convention_must_allow_self_service_signups
    return if allow_non_self_service_signups
    return if convention.signup_mode == "self_service"
    return if team_member?

    errors.add :base, I18n.t("signups.errors.wrong_signup_mode")
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
      errors.add :base, I18n.t("signups.errors.closed")
    else
      user_signup_count = user_signup_constraints.current_signup_count
      unless user_signup_constraints.signup_count_allowed?(user_signup_count + 1)
        errors.add :base, I18n.t("signups.errors.already_at_max", count: user_signup_count)
      end
    end
  end

  def signup_count_check_required?
    return false if team_member?
    return false if Signup::SLOT_OCCUPYING_STATES.include?(signup_state) && !counts_towards_total?

    true
  end

  def conflicting_signups
    @conflicting_signups ||=
      begin
        conflicts = user_signup_constraints.conflicting_signups_for_run(run, allow_team_member: team_member?)
        if action == "accept_signup_request"
          conflicts.reject { |conflict| conflict.is_a?(SignupRequest) && conflict.target_run == run }
        else
          conflicts
        end
      end
  end

  def must_not_have_conflicting_signups
    return unless !event.can_play_concurrently? && conflicting_signups.any?

    errors.add :base,
               I18n.t(
                 "signups.errors.conflicts",
                 conflict_descriptions: user_signup_constraints.conflict_descriptions(conflicting_signups),
                 count: conflicting_signups.size,
                 event_title: event.title
               )
  end

  def must_have_ticket_if_required
    return if user_signup_constraints.has_ticket_if_required?

    if user_con_profile.ticket
      errors.add :base,
                 I18n.t(
                   "signups.errors.ticket_does_not_allow_signups",
                   ticket_type_description: user_con_profile.ticket.ticket_type.description,
                   convention_name: convention.name
                 )
    else
      errors.add :base,
                 I18n.t(
                   "signups.errors.no_ticket",
                   ticket_name: convention.ticket_name,
                   convention_name: convention.name
                 )
    end
  end

  def must_not_already_be_signed_up
    already_signed_up =
      existing_signups.reject(&:withdrawn?).any? { |signup| signup.user_con_profile_id == user_con_profile.id }

    return unless already_signed_up

    errors.add :base, I18n.t("signups.errors.already_signed_up", event_title: event.title)
  end

  def must_not_have_signup_rounds_due
    return if action == "accept_signup_ranked_choice"
    return unless convention.signup_automation_mode == "ranked_choice"
    return unless convention.signup_rounds.currently_due.any?

    errors.add :base, I18n.t("signups.errors.signup_round_in_progress")
  end

  def require_valid_bucket
    return if run.registration_policy.allow_no_preference_signups? && !requested_bucket_key

    requested_bucket = run.registration_policy.bucket_with_key(requested_bucket_key)
    return if requested_bucket && !requested_bucket.anything?

    non_anything_buckets = run.registration_policy.buckets.reject(&:anything?)
    errors.add :base,
               I18n.t("signups.errors.invalid_bucket", valid_buckets: non_anything_buckets.map(&:name).join(", "))
  end

  def require_no_bucket_for_team_member
    return unless team_member?
    return unless requested_bucket_key

    errors.add :base, I18n.t("signups.errors.team_members_cannot_be_counted")
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
    Signups::NewSignupNotifier.new(signup:).deliver_later(wait: 5.seconds)
  end

  def send_confirmation(signup)
    return if suppress_confirmation

    # Wait 5 seconds because the transaction hasn't been committed yet
    Signups::SignupConfirmationNotifier.new(signup:).deliver_later(wait: 5.seconds)
  end
end
