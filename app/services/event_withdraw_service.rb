class EventWithdrawService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :move_results, :prev_bucket_key, :prev_state
  end
  self.result_class = Result

  attr_reader :signup, :whodunit, :suppress_notifications, :allow_non_self_service_signups,
    :move_results, :prev_bucket_key, :prev_state
  delegate :run, to: :signup
  delegate :event, to: :run
  delegate :convention, to: :event

  include SkippableAdvisoryLock
  include ConventionRegistrationFreeze

  def initialize(
    signup, whodunit,
    skip_locking: false, suppress_notifications: false
  )
    @signup = signup
    @whodunit = whodunit
    @skip_locking = skip_locking
    @suppress_notifications = suppress_notifications
    @move_results = []
    @prev_state = signup.state
    @prev_bucket_key = signup.bucket_key
  end

  private

  def inner_call
    with_advisory_lock_unless_skip_locking("run_#{run.id}_signups") do
      signup.update!(state: 'withdrawn', updated_by: whodunit)
      signup.log_signup_change!(action: 'withdraw')

      move_result = move_signups(signup, prev_state, prev_bucket_key)
      return move_result if move_result.failure?
    end

    notify_team_members(signup, prev_state, prev_bucket_key, move_results)
    success(prev_state: prev_state, prev_bucket_key: prev_bucket_key, move_results: move_results)
  end

  def notify_team_members(signup, prev_state, prev_bucket_key, move_results)
    return if suppress_notifications

    # Wait 30 seconds because the transaction hasn't been committed yet
    Signups::WithdrawalNotifier.new(
      signup: signup,
      prev_state: prev_state,
      prev_bucket_key: prev_bucket_key,
      move_results: move_results
    ).deliver_later(wait: 5.seconds)
  end

  def move_signups(signup, prev_state, prev_bucket_key)
    return success unless signup.counted? && prev_state == 'confirmed'

    vacancy_fill_result = fill_vacancy(prev_bucket_key)
    return failure(vacancy_fill_result.errors) if vacancy_fill_result.failure?

    @move_results = vacancy_fill_result.move_results
    vacancy_fill_result
  end

  def fill_vacancy(prev_bucket_key)
    EventVacancyFillService.new(run, prev_bucket_key, skip_locking: true).call
  end
end
