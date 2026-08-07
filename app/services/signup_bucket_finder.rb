# frozen_string_literal: true
# registration_policy here may be a detached, not-yet-persisted policy (e.g. while
# EventChangeRegistrationPolicyService is simulating a registration policy change), whose candidate
# buckets have no id yet. Bucket comparisons throughout this class go through id when both sides are
# persisted, and object identity otherwise -- see RegistrationPolicyBucket#occupies_bucket_as_signup?
# and #same_bucket? below.
class SignupBucketFinder
  class FakeSignup
    include ActiveModel::Model

    attr_accessor :id, :state, :run, :bucket, :requested_bucket, :user_con_profile, :counted

    def self.from_signup(signup)
      attrs =
        %i[id state run bucket requested_bucket user_con_profile counted].index_with { |attr| signup.public_send(attr) }

      new(attrs)
    end

    def attributes
      { id:, state:, run:, bucket:, requested_bucket:, user_con_profile:, counted: }
    end

    def bucket_id
      bucket&.id
    end

    def occupying_slot?
      Signup::SLOT_OCCUPYING_STATES.include?(state)
    end
  end

  attr_reader :registration_policy, :other_signups, :requested_bucket, :allow_movement

  def initialize(registration_policy, requested_bucket, other_signups, allow_movement: true)
    @registration_policy = registration_policy
    @requested_bucket = requested_bucket
    @allow_movement = allow_movement
    @original_other_signups_by_id = other_signups.index_by(&:id)
    @other_signups = other_signups.map { |signup| FakeSignup.from_signup(signup) }
  end

  def simulate_accepting_signup_request(signup_request)
    accept_finder =
      SignupBucketFinder.new(registration_policy, signup_request.requested_bucket, @other_signups, allow_movement:)
    actual_bucket = accept_finder.find_bucket

    if actual_bucket
      if actual_bucket.full?(other_signups)
        movable_signup = accept_finder.movable_signups_for_bucket(actual_bucket).first
        destination_bucket =
          accept_finder.no_preference_bucket_finder.prioritized_buckets_with_capacity_except(actual_bucket).first
        movable_signup.bucket = destination_bucket
      end

      simulate_confirmed_signup(signup_request, actual_bucket)
    else
      simulate_waitlist(signup_request)
    end
  end

  def simulate_confirmed_signup(signup_request, actual_bucket)
    @other_signups << FakeSignup.new(
      run: signup_request.target_run,
      state: "confirmed",
      bucket: actual_bucket,
      user_con_profile: signup_request.user_con_profile,
      requested_bucket: signup_request.requested_bucket,
      counted: actual_bucket.counted?
    )
  end

  def simulate_waitlist(signup_request)
    @other_signups << FakeSignup.new(
      run: signup_request.target_run,
      state: "waitlisted",
      bucket: nil,
      user_con_profile: signup_request.user_con_profile,
      requested_bucket: signup_request.requested_bucket,
      counted: false
    )
  end

  def find_bucket
    # try not to bump people out of their signup buckets...
    @actual_bucket ||=
      prioritized_buckets_with_capacity.first ||
        # but do it if you have to
        prioritized_buckets.find { |bucket| movable_signups_for_bucket(bucket).any? }
  end

  def movable_signups_for_bucket(bucket)
    return [] unless allow_movement
    return [] unless no_preference_bucket_finder.prioritized_buckets_with_capacity.any?

    fake_signups = other_signups.select { |signup| same_bucket?(signup.bucket, bucket) && !signup.requested_bucket }
    fake_signups.filter_map { |fake_signup| @original_other_signups_by_id[fake_signup.id] }
  end

  def prioritized_buckets
    @prioritized_buckets ||=
      requested_bucket ? prioritized_buckets_with_requested_bucket : prioritized_buckets_without_requested_bucket
  end

  def prioritized_buckets_with_capacity
    @prioritized_buckets_with_capacity ||= prioritized_buckets.reject { |bucket| bucket.full?(other_signups) }
  end

  def prioritized_buckets_with_capacity_except(*buckets)
    prioritized_buckets_with_capacity.reject { |candidate| buckets.any? { |bucket| same_bucket?(candidate, bucket) } }
  end

  def no_preference_bucket_finder
    SignupBucketFinder.new(registration_policy, nil, other_signups, allow_movement:)
  end

  private

  # Compares by id when both buckets are persisted, object identity otherwise -- mirrors
  # RegistrationPolicyBucket#occupies_bucket_as_signup?, since a detached candidate bucket has no id
  # to compare and only object identity can tell it apart from another detached candidate.
  def same_bucket?(bucket_a, bucket_b)
    return false if bucket_a.nil? || bucket_b.nil?
    bucket_a.id && bucket_b.id ? bucket_a.id == bucket_b.id : bucket_a.equal?(bucket_b)
  end

  def prioritized_buckets_with_requested_bucket
    [requested_bucket, (requested_bucket&.not_counted? ? nil : registration_policy.anything_bucket)].compact
  end

  def prioritized_buckets_without_requested_bucket
    registration_policy
      .buckets
      .select(&:counted?)
      .select(&:slots_limited?)
      .sort_by { |bucket| bucket.anything? ? 0 : 1 }
  end

  def slot_occupying_signups
    @slot_occupying_signups ||=
      other_signups.select do |signup|
        signup.is_a?(Signup) && signup.bucket&.signup_definitely_occupies_slot_in_bucket?(signup)
      end
  end

  def pending_signup_requests
    @pending_signup_requests ||=
      other_signups.select { |signup| signup.is_a?(SignupRequest) && signup.state == "pending" }
  end

  def totally_full_including_signup_requests?
    return false if registration_policy.slots_unlimited?
    return false if requested_bucket&.not_counted?

    slot_occupying_signups.size + pending_signup_requests.size >= registration_policy.total_slots
  end
end
