class CreateSignupRequestService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :signup_request
  end
  self.result_class = Result

  validate :convention_must_allow_signup_requests
  validate :signup_requests_must_be_open
  validate :must_not_have_conflicting_signups

  attr_reader :user_con_profile,
              :target_run,
              :requested_bucket_key,
              :replace_signup,
              :whodunit,
              :suppress_notifications,
              :keep_pending_ranked_choices,
              :action
  delegate :convention, to: :user_con_profile
  delegate :event, to: :target_run

  include ConventionRegistrationFreeze
  include SignupCountLimits

  def initialize(
    user_con_profile:,
    target_run:,
    requested_bucket_key:,
    replace_signup: nil,
    whodunit: nil,
    suppress_notifications: false,
    keep_pending_ranked_choices: false,
    action: "self_service_signup_request"
  )
    @user_con_profile = user_con_profile
    @target_run = target_run
    @requested_bucket_key = requested_bucket_key
    @replace_signup = replace_signup
    @whodunit = whodunit
    @suppress_notifications = suppress_notifications
    @keep_pending_ranked_choices = keep_pending_ranked_choices
    @action = action
  end

  private

  def inner_call
    signup_request =
      user_con_profile.signup_requests.create!(
        target_run:,
        replace_signup:,
        requested_bucket_key:,
        updated_by: whodunit
      )
    destroy_pending_ranked_choices

    unless suppress_notifications
      SignupRequests::NewSignupRequestNotifier.new(signup_request:, triggering_user: whodunit).deliver_later
    end

    success(signup_request:)
  end

  def convention_must_allow_signup_requests
    return if convention.signup_mode == "moderated"
    errors.add :base, I18n.t("signup_requests.errors.wrong_signup_mode")
  end

  def signup_requests_must_be_open
    return if action == "accept_signup_ranked_choice"
    return if convention.signup_requests_open?

    errors.add :base, I18n.t("signup_requests.errors.closed")
  end

  def user_signup_constraints
    @user_signup_constraints ||= UserSignupConstraints.new(user_con_profile)
  end

  def conflicting_signups
    @conflicting_signups ||=
      user_signup_constraints.conflicting_signups_for_run(target_run, allow_team_member: false) - [replace_signup]
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

  def destroy_pending_ranked_choices
    return if keep_pending_ranked_choices

    user_con_profile
      .signup_ranked_choices
      .where(state: "pending", target_run_id: target_run.id, requested_bucket_key:)
      .destroy_all
  end

  # This is required by SignupCountLimits validations
  def signup_state
    "confirmed"
  end

  def counts_towards_total?
    target_bucket = event.registration_policy.bucket_with_key(requested_bucket_key)
    target_bucket.nil? || target_bucket.counted?
  end
end
