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
      signup_ranked_choice.update!(state: "signed_up", result_signup: signup_result.signup)
      notify_user
      success(signup: signup_result.signup)
    else
      signup_request = nil
      with_relevant_locks { signup_request = create_signup_request }
      signup_ranked_choice.update!(state: "requested", result_signup_request: signup_request)
      notify_user
      success(signup_requsest: signup_request)
    end
  end

  def with_relevant_locks(&block)
    with_advisory_lock_unless_skip_locking("run_#{signup_ranked_choice.target_run.id}_signups") do
      if signup_ranked_choice.replace_signup
        with_advisory_lock_unless_skip_locking("run_#{signup_ranked_choice.replace_signup.run.id}_signups", &block)
      else
        yield
      end
    end
  end

  def create_signup
    EventSignupService.new(
      signup_ranked_choice.user_con_profile,
      signup_ranked_choice.target_run,
      signup_ranked_choice.requested_bucket_key,
      whodunit,
      skip_locking: true,
      suppress_notifications: suppress_notifications,
      suppress_confirmation: true, # notify_user will take care of this separately
      action: "accept_signup_ranked_choice"
    ).call!
  end

  def create_signup_request
    signup_ranked_choice.user_con_profile.signup_requests.create!(
      target_run: signup_ranked_choice.target_run,
      requested_bucket_key: signup_ranked_choice.requested_bucket_key
    )
  end

  def notify_user
    return if suppress_notifications

    # 5-second delay to let the transaction commit
    SignupRequests::RequestAcceptedNotifier.new(signup_ranked_choice: signup_ranked_choice).deliver_later(
      wait: 5.seconds
    )
  end
end
