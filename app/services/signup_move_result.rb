class SignupMoveResult
  include GlobalID::Identification

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

  def id
    [signup_id, state, bucket_key, prev_state, prev_bucket_key].join('-')
  end

  def self.find(id)
    signup_id, state, bucket_key, prev_state, prev_bucket_key = id.split('-')
    new(signup_id.to_i, state, bucket_key.presence, prev_state, prev_bucket_key.presence)
  end

  def signup
    @signup ||= Signup.find(signup_id)
  end

  def bucket
    return unless bucket_key
    signup.event.registration_policy.bucket_with_key(bucket_key)
  end

  def prev_bucket
    return unless prev_bucket_key
    signup.event.registration_policy.bucket_with_key(prev_bucket_key)
  end

  def should_notify?
    state != prev_state
  end

  def to_liquid
    SignupMoveResultDrop.new(self)
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
