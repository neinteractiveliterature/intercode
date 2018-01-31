class EventWithdrawService < ApplicationService
  class Result < ServiceResult
    attr_accessor :move_results, :prev_bucket_key, :prev_state
  end
  self.result_class = Result

  attr_reader :signup, :whodunit
  delegate :run, to: :signup
  delegate :event, to: :run
  delegate :convention, to: :event

  include Concerns::ConventionRegistrationFreeze

  def initialize(signup, whodunit, skip_locking: false)
    @signup = signup
    @whodunit = whodunit
    @skip_locking = skip_locking
  end

  private

  def inner_call
    prev_state = signup.state
    prev_bucket_key = signup.bucket_key
    move_results = nil

    with_advisory_lock_unless_skip_locking("run_#{run.id}_signups") do
      signup.update!(state: 'withdrawn', updated_by: whodunit)

      move_results = if signup.counted? && prev_state == 'confirmed'
        vacancy_fill_result = EventVacancyFillService.new(
          run,
          prev_bucket_key,
          skip_locking: true
        ).call
        return failure(vacancy_fill_result.error) if vacancy_fill_result.failure?
        vacancy_fill_result.move_results
      else
        []
      end
    end

    notify_team_members(signup, prev_state, prev_bucket_key, move_results)
    success(prev_state: prev_state, prev_bucket_key: prev_bucket_key, move_results: move_results)
  end

  def notify_team_members(signup, prev_state, prev_bucket_key, move_results)
    event.team_members.where(receive_signup_email: true).find_each do |team_member|
      EventSignupMailer.withdrawal(
        signup,
        prev_state,
        prev_bucket_key,
        move_results.map(&:to_h),
        team_member
      ).deliver_later
    end
  end
end
