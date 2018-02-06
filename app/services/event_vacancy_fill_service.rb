class EventVacancyFillService < ApplicationService
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

    def should_notify?
      state != prev_state
    end

    def self.from_h(hash)
      hash = hash.symbolize_keys
      new(
        hash[:signup_id],
        hash[:state],
        hash[:bucket_key],
        hash[:prev_state],
        hash[:prev_bucket_key]
      )
    end

    def self.from_signup(signup, prev_state, prev_bucket_key)
      new(signup.id, signup.state, signup.bucket_key, prev_state, prev_bucket_key)
    end
  end

  class Result < ServiceResult
    attr_accessor :move_results
  end
  self.result_class = Result

  attr_reader :run, :bucket_key, :move_results
  delegate :event, to: :run
  delegate :convention, to: :event

  include Concerns::ConventionRegistrationFreeze

  def initialize(run, bucket_key, skip_locking: false)
    @run = run
    @bucket_key = bucket_key
    @skip_locking = skip_locking
    @move_results = []
  end

  private

  def inner_call
    with_advisory_lock_unless_skip_locking("run_#{run.id}_signups") do
      fill_bucket_vacancy(bucket_key)
    end

    move_results.each do |result|
      notify_moved_signup(result) if result.should_notify?
    end
    success(move_results: move_results)
  end

  def fill_bucket_vacancy(bucket_key)
    signup_to_move = best_signup_to_fill_bucket_vacancy(bucket_key)
    return unless signup_to_move

    moving_confirmed_signup = signup_to_move.confirmed?
    prev_bucket_key = signup_to_move.bucket_key
    prev_state = signup_to_move.state
    signup_to_move.update!(state: 'confirmed', bucket_key: bucket_key)
    move_results << SignupMoveResult.from_signup(signup_to_move, prev_state, prev_bucket_key)

    # We left a vacancy by moving a confirmed signup out of its bucket, so recursively try to fill
    # that vacancy
    fill_bucket_vacancy(prev_bucket_key) if moving_confirmed_signup
  end

  def best_signup_to_fill_bucket_vacancy(bucket_key)
    bucket = event.registration_policy.bucket_with_key(bucket_key)
    signups_ordered.find do |signup|
      next if move_results.any? { |result| result.signup_id == signup.id }
      signup.bucket_key != bucket.key && signup_can_fill_bucket_vacancy?(signup, bucket)
    end
  end

  def signup_can_fill_bucket_vacancy?(signup, bucket)
    (
      signup.requested_bucket_key.nil? ||
      signup.requested_bucket_key == bucket.key ||
      bucket.anything?
    )
  end

  def signups_ordered
    @signups_ordered ||= begin
      run.signups.reload
      run.signups.where.not(state: 'withdrawn').to_a.sort_by do |signup|
        [
          # don't move no-preference signups unless necessary
          signup.requested_bucket_key.nil? ? 1 : 0,
          signup.created_at
        ]
      end
    end
  end

  def notify_moved_signup(result)
    EventSignupMailer.user_signup_moved(result.to_h).deliver_later
  end
end
