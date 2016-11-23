class EventWithdrawService
  class Result
    attr_reader :error, :move_results

    def self.success(move_results)
      new(true, move_results, nil)
    end

    def self.failure(error)
      new(false, nil, error)
    end

    def initialize(success, move_results, error)
      @success = success
      @move_results = move_results
      @error = error
    end

    def success?
      @success
    end

    def failure?
      !success?
    end
  end

  class SignupMoveResult
    attr_reader :signup, :prev_state, :prev_bucket_key
    delegate :state, :bucket_key, :user_con_profile, to: :signup

    def initialize(signup, prev_state, prev_bucket_key)
      @signup = signup
      @prev_state = prev_state
      @prev_bucket_key = prev_bucket_key
    end
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

    update_signup!(signup, state: 'withdrawn', updated_by: whodunit)

    move_results = if signup.counted? && prev_state == 'confirmed'
      fill_bucket_vacancy(prev_bucket_key)
    else
      []
    end

    notify_team_members(signup, move_results)
    move_results.each { |result| notify_moved_signup(result) }
    Result.success(move_results)
  end

  private

  def fill_bucket_vacancy(bucket_key)
    signup_to_move = best_signup_to_fill_bucket_vacancy(bucket_key)
    return [] unless signup_to_move

    moving_confirmed_signup = signup_to_move.confirmed?
    prev_bucket_key = signup_to_move.bucket_key
    prev_state = signup_to_move.state
    update_signup!(signup_to_move, state: 'confirmed', bucket_key: bucket_key)
    result = SignupMoveResult.new(signup_to_move, prev_state, prev_bucket_key)

    if moving_confirmed_signup
      # We left a vacancy by moving a confirmed signup out of its bucket, so recursively try to fill that vacancy
      [result] + fill_bucket_vacancy(prev_bucket_key)
    else
      [result]
    end
  end

  def signups_ordered
    @signups_ordered ||= begin
      run.signups.reload
      run.signups.order(:created_at).to_a
    end
  end

  def update_signup!(signup, params)
    signup.update!(params)
    @signups_ordered = nil
  end

  def best_signup_to_fill_bucket_vacancy(bucket_key)
    bucket = event.registration_policy.bucket_with_key(bucket_key)
    is_anything_bucket = bucket.anything?

    signups_ordered.find do |signup|
      (
        # Confirmed signups that requested this bucket but didn't get it
        (signup.confirmed? && signup.bucket_key != bucket_key && signup.requested_bucket_key == bucket_key) ||
        # Signups in the waitlist that could be in this bucket
        (signup.waitlisted? && (is_anything_bucket || signup.requested_bucket_key == bucket_key))
      )
    end
  end

  def event
    @event ||= run.event
  end

  def notify_team_members(signup, move_results)
    # TODO
  end

  def notify_moved_signup(result)
    # TODO
  end
end