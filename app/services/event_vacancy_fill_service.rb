class EventVacancyFillService
  class SignupMoveResult
    attr_reader :signup_id, :state, :bucket_key, :prev_state, :prev_bucket_key

    def initialize(signup_id, state, bucket_key, prev_state, prev_bucket_key)
      @signup_id = signup_id
      @state = state
      @bucket_key = bucket_key
      @prev_state = prev_state
      @prev_bucket_key = prev_bucket_key
    end

    def to_h
      {
        signup_id: signup_id,
        state: state,
        bucket_key: bucket_key,
        prev_state: prev_state,
        prev_bucket_key: prev_bucket_key
      }
    end

    def signup
      @signup ||= Signup.find(signup_id)
    end

    def self.from_h(hash)
      hash = hash.symbolize_keys
      new(hash[:signup_id], hash[:state], hash[:bucket_key], hash[:prev_state], hash[:prev_bucket_key])
    end

    def self.from_signup(signup, prev_state, prev_bucket_key)
      new(signup.id, signup.state, signup.bucket_key, prev_state, prev_bucket_key)
    end
  end

  class Result < ServiceResult
    attr_accessor :move_results
  end

  attr_reader :run, :bucket_key

  def initialize(run, bucket_key)
    @run = run
    @bucket_key = bucket_key
  end

  def call
    move_results = fill_bucket_vacancy(bucket_key)
    move_results.each { |result| notify_moved_signup(result) }
    success(move_results)
  end

  private

  def success(move_results)
    Result.success(move_results: move_results)
  end

  def failure(errors)
    Result.failure(errors: errors)
  end

  def fill_bucket_vacancy(bucket_key)
    signup_to_move = best_signup_to_fill_bucket_vacancy(bucket_key)
    return [] unless signup_to_move

    moving_confirmed_signup = signup_to_move.confirmed?
    prev_bucket_key = signup_to_move.bucket_key
    prev_state = signup_to_move.state
    signup_to_move.update!(state: 'confirmed', bucket_key: bucket_key)
    result = SignupMoveResult.from_signup(signup_to_move, prev_state, prev_bucket_key)

    if moving_confirmed_signup
      # We left a vacancy by moving a confirmed signup out of its bucket, so recursively try to fill that vacancy
      [result] + fill_bucket_vacancy(prev_bucket_key)
    else
      [result]
    end
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

  def signups_ordered
    @signups_ordered ||= begin
      run.signups.reload
      run.signups.order(:created_at).to_a
    end
  end

  def event
    @event ||= run.event
  end

  def notify_moved_signup(result)
    EventSignupMailer.user_signup_moved(result.to_h).deliver_later
  end
end