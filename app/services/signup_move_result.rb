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
