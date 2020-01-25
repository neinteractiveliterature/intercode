class AcceptSignupRequestService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :signup, :withdraw_result
  end
  self.result_class = Result

  include SkippableAdvisoryLock

  attr_reader :signup_request, :whodunit, :suppress_notifications

  def initialize(signup_request:, whodunit:, skip_locking: false, suppress_notifications: false)
    @signup_request = signup_request
    @whodunit = whodunit
    @skip_locking = skip_locking
    @suppress_notifications = suppress_notifications
  end

  private

  def inner_call
    signup_result = nil
    withdraw_result = nil

    with_relevant_locks do
      withdraw_result = withdraw_replace_signup
      signup_result = create_signup
    end

    signup_request.update!(state: 'accepted', result_signup: signup_result.signup)

    notify_user
    success(signup: signup_result.signup, withdraw_result: withdraw_result)
  end

  def with_relevant_locks
    with_advisory_lock_unless_skip_locking("run_#{signup_request.target_run.id}_signups") do
      if signup_request.replace_signup
        with_advisory_lock_unless_skip_locking(
          "run_#{signup_request.replace_signup.run.id}_signups"
        ) do
          yield
        end
      else
        yield
      end
    end
  end

  def withdraw_replace_signup
    return unless signup_request.replace_signup

    EventWithdrawService.new(
      signup_request.replace_signup,
      whodunit,
      skip_locking: true,
      suppress_notifications: suppress_notifications
    ).call!
  end

  def create_signup
    EventSignupService.new(
      signup_request.user_con_profile,
      signup_request.target_run,
      signup_request.requested_bucket_key,
      whodunit,
      skip_locking: true,
      allow_non_self_service_signups: true,
      suppress_notifications: suppress_notifications
    ).call!
  end

  def notify_user
    return if suppress_notifications
    # 5-second delay to let the transaction commit
    SignupRequests::RequestAcceptedNotifier.new(signup_request: signup_request)
      .deliver_later(wait: 5.seconds)
  end
end
