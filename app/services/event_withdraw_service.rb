# frozen_string_literal: true
class EventWithdrawService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :move_results, :prev_bucket_key, :prev_state
  end
  self.result_class = Result

  attr_reader :signup,
              :whodunit,
              :suppress_notifications,
              :suppress_confirmation,
              :allow_non_self_service_signups,
              :move_results,
              :prev_bucket_key,
              :prev_state,
              :prev_counted,
              :action
  delegate :run, to: :signup
  delegate :event, to: :run
  delegate :convention, to: :event

  include SkippableAdvisoryLock
  include ConventionRegistrationFreeze

  validate :run_must_not_be_over
  validate :must_not_have_signup_rounds_due

  def initialize(
    signup,
    whodunit,
    skip_locking: false,
    suppress_notifications: false,
    suppress_confirmation: false,
    action: "withdraw"
  )
    @signup = signup
    @whodunit = whodunit
    @skip_locking = skip_locking
    @suppress_notifications = suppress_notifications
    @suppress_confirmation = suppress_confirmation
    @action = action
    @move_results = []
    @prev_state = signup.state
    @prev_bucket_key = signup.bucket_key
    @prev_counted = signup.counted?
  end

  private

  def inner_call
    with_advisory_lock_unless_skip_locking("run_#{run.id}_signups") do
      signup.update!(state: "withdrawn", bucket_key: nil, counted: false, updated_by: whodunit)
      signup.log_signup_change!(action:)

      move_result = move_signups(prev_state, prev_bucket_key, prev_counted)
      return move_result if move_result.failure?
    end

    notify_team_members(signup, prev_state, prev_bucket_key, move_results)
    send_confirmation(signup, prev_state, prev_bucket_key)
    success(prev_state:, prev_bucket_key:, move_results:)
  end

  def notify_team_members(signup, prev_state, prev_bucket_key, move_results)
    return if suppress_notifications

    # Wait 5 seconds because the transaction hasn't been committed yet
    Signups::WithdrawalNotifier.new(
      signup:,
      prev_state:,
      prev_bucket_key:,
      move_results:,
      triggering_user: whodunit
    ).deliver_later(wait: 5.seconds)
  end

  def send_confirmation(signup, prev_state, prev_bucket_key)
    return if suppress_confirmation

    # Wait 5 seconds because the transaction hasn't been committed yet
    Signups::WithdrawConfirmationNotifier.new(
      signup:,
      prev_state:,
      prev_bucket_key:,
      triggering_user: whodunit
    ).deliver_later(wait: 5.seconds)
  end

  def move_signups(prev_state, prev_bucket_key, prev_counted)
    return success unless prev_counted && prev_state == "confirmed"
    if prev_bucket_key
      # Don't fill vacancies in a previously-overfilled bucket
      prev_bucket = signup.run.event.registration_policy.bucket_with_key(prev_bucket_key)
      return success if prev_bucket&.full?(signup.run.signups)
    end

    vacancy_fill_result = fill_vacancy(prev_bucket_key)
    return failure(vacancy_fill_result.errors) if vacancy_fill_result.failure?

    @move_results = vacancy_fill_result.move_results
    vacancy_fill_result
  end

  def fill_vacancy(prev_bucket_key)
    EventVacancyFillService.new(run, prev_bucket_key, skip_locking: true).call
  end

  def run_must_not_be_over
    return unless run.ends_at < Time.now
    errors.add :base, "#{event.title} has ended."
  end

  def must_not_have_signup_rounds_due
    return unless convention.signup_automation_mode == "ranked_choice"
    return unless convention.signup_rounds.currently_due.any?

    errors.add :base,
               "We are currently processing ranked choice signups for this round. Please wait a moment and try again."
  end
end
