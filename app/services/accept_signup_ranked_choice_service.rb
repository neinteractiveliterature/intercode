# frozen_string_literal: true
class AcceptSignupRankedChoiceService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :signup, :signup_request
  end
  self.result_class = Result

  include SkippableAdvisoryLock

  attr_reader :signup_ranked_choice, :whodunit, :suppress_notifications

  def initialize(signup_ranked_choice:, whodunit:, skip_locking: false, suppress_notifications: false)
    @signup_ranked_choice = signup_ranked_choice
    @whodunit = whodunit
    @skip_locking = skip_locking
    @suppress_notifications = suppress_notifications
  end

  private

  def inner_call
    if signup_ranked_choice.convention.signup_mode == "self_service"
      signup_result = nil
      with_relevant_locks { signup_result = create_signup }
      signup_ranked_choice.update!(
        state: signup_result.signup.confirmed? ? "signed_up" : "waitlisted",
        result_signup: signup_result.signup
      )
      success(signup: signup_result.signup)
    else
      signup_request_result = nil
      with_relevant_locks { signup_request_result = create_signup_request }
      signup_ranked_choice.update!(state: "requested", result_signup_request: signup_request_result.signup_request)
      success(signup_request: signup_request_result.signup_request)
    end
  end

  def with_relevant_locks(&)
    with_advisory_lock_unless_skip_locking("run_#{signup_ranked_choice.target_run.id}_signups", &)
  end

  def create_signup
    EventSignupService.new(
      signup_ranked_choice.user_con_profile,
      signup_ranked_choice.target_run,
      signup_ranked_choice.requested_bucket_key,
      whodunit,
      skip_locking: true,
      suppress_notifications:,
      suppress_confirmation: suppress_notifications,
      action: "accept_signup_ranked_choice",
      keep_pending_ranked_choices: true
    ).call!
  end

  def create_signup_request
    CreateSignupRequestService.new(
      user_con_profile: signup_ranked_choice.user_con_profile,
      target_run: signup_ranked_choice.target_run,
      requested_bucket_key: signup_ranked_choice.requested_bucket_key,
      whodunit:,
      # Never send notifications when creating SignupRequests from ranked choices
      suppress_notifications: true,
      action: "accept_signup_ranked_choice",
      keep_pending_ranked_choices: true
    ).call!
  end
end
