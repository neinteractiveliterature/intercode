# frozen_string_literal: true
class SignupMoveResult
  include GlobalID::Identification

  attr_reader :signup_id, :state, :bucket_id, :prev_state, :prev_bucket_id

  # bucket_name/prev_bucket_name are point-in-time snapshots of the bucket's human-readable name,
  # analogous to signup_changes.bucket_name/requested_bucket_name (see #bucket_name/#prev_bucket_name
  # below). They matter because bucket_id and prev_bucket_id are resolved live against the signup's
  # *current* registration policy (see #bucket and #prev_bucket below) -- but a registration policy
  # change can move a signup out of a bucket in the very same operation that deletes that bucket
  # (EventChangeRegistrationPolicyService destroys removed buckets before this result is even
  # constructed), so a live lookup for prev_bucket_id can legitimately come up empty. The caller
  # passes the name it already knows at construction time, so display code (e.g.
  # move_results_list.liquid) doesn't silently lose it.

  # rubocop:disable Metrics/ParameterLists
  def initialize(signup_id, state, bucket_id, prev_state, prev_bucket_id, bucket_name: nil, prev_bucket_name: nil)
    @signup_id = signup_id
    @state = state
    @bucket_id = bucket_id
    @prev_state = prev_state
    @prev_bucket_id = prev_bucket_id
    @bucket_name = bucket_name
    @prev_bucket_name = prev_bucket_name
  end
  # rubocop:enable Metrics/ParameterLists

  def to_h
    {
      signup_id: signup_id,
      state: state,
      bucket_id: bucket_id,
      prev_state: prev_state,
      prev_bucket_id: prev_bucket_id,
      bucket_name: bucket_name,
      prev_bucket_name: prev_bucket_name
    }
  end

  # bucket_name/prev_bucket_name are free text (an admin-entered bucket name, unlike the old
  # normalized [a-z0-9_]-only bucket_key), so they can contain any character -- including the
  # delimiter this used to join fields with. JSON-encode the whole payload instead of joining with
  # a separator, so no field's content can corrupt the encoding.
  def id
    Base64.urlsafe_encode64(
      JSON.generate([signup_id, state, bucket_id, prev_state, prev_bucket_id, bucket_name, prev_bucket_name])
    )
  end

  def self.find(id)
    signup_id, state, bucket_id, prev_state, prev_bucket_id, bucket_name, prev_bucket_name =
      JSON.parse(Base64.urlsafe_decode64(id))
    new(signup_id, state, bucket_id, prev_state, prev_bucket_id, bucket_name:, prev_bucket_name:)
  end

  def signup
    @signup ||= Signup.find(signup_id)
  end

  def bucket
    return unless bucket_id
    signup.event.registration_policy.bucket_with_id(bucket_id)
  end

  def prev_bucket
    return unless prev_bucket_id
    signup.event.registration_policy.bucket_with_id(prev_bucket_id)
  end

  def bucket_name
    @bucket_name || bucket&.name
  end

  def prev_bucket_name
    @prev_bucket_name || prev_bucket&.name
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
      hash[:bucket_id],
      hash[:prev_state],
      hash[:prev_bucket_id],
      bucket_name: hash[:bucket_name],
      prev_bucket_name: hash[:prev_bucket_name]
    )
  end

  def self.from_signup(signup, prev_state, prev_bucket_id)
    new(signup.id, signup.state, signup.bucket_id, prev_state, prev_bucket_id)
  end
end
