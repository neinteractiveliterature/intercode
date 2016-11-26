class EventWithdrawService
  class Result < ServiceResult
    attr_accessor :move_results
  end

  attr_reader :signup, :whodunit
  delegate :run, to: :signup

  def initialize(signup, whodunit)
    @signup = signup
    @whodunit = whodunit
  end

  def call
    # TODO fail if registrations are locked

    prev_state = signup.state
    prev_bucket_key = signup.bucket_key

    signup.update!(state: 'withdrawn', updated_by: whodunit)

    move_results = if signup.counted? && prev_state == 'confirmed'
      vacancy_fill_result = EventVacancyFillService.new(run, prev_bucket_key).call
      return failure(vacancy_fill_result.error) if vacancy_fill_result.failure?
      vacancy_fill_result.move_results
    else
      []
    end

    notify_team_members(signup, move_results)
    success(move_results)
  end

  private

  def success(move_results)
    Result.success(move_results: move_results)
  end

  def failure(error)
    Result.failure(error: error)
  end

  def event
    @event ||= run.event
  end

  def notify_team_members(signup, move_results)
    event.team_members.where(receive_signup_email: true).find_each do |team_member|
      EventSignupMailer.withdrawal(signup, move_results.map(&:to_h), team_member).deliver_later
    end
  end
end