# frozen_string_literal: true
class SignupBucketFinder
  attr_reader :registration_policy, :other_signups, :requested_bucket_key, :allow_movement

  def initialize(registration_policy, requested_bucket_key, other_signups, allow_movement: true)
    @registration_policy = registration_policy
    @requested_bucket_key = requested_bucket_key
    @other_signups = other_signups
    @allow_movement = allow_movement
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

    other_signups.select do |signup|
      (signup.respond_to?(:bucket_key) && signup.bucket_key == bucket.key) &&
        !(signup.respond_to?(:requested_bucket_key) && signup.requested_bucket_key)
    end
  end

  def prioritized_buckets
    @prioritized_buckets ||=
      requested_bucket_key ? prioritized_buckets_with_requested_bucket : prioritized_buckets_without_requested_bucket
  end

  def prioritized_buckets_with_capacity
    @prioritized_buckets_with_capacity ||= prioritized_buckets.reject { |bucket| bucket.full?(other_signups) }
  end

  def prioritized_buckets_with_capacity_except(*buckets)
    bucket_keys = buckets.map(&:key)
    prioritized_buckets_with_capacity.reject { |bucket| bucket_keys.include?(bucket.key) }
  end

  def no_preference_bucket_finder
    SignupBucketFinder.new(registration_policy, nil, other_signups, allow_movement: allow_movement)
  end

  private

  def prioritized_buckets_with_requested_bucket
    requested_bucket = registration_policy.bucket_with_key(requested_bucket_key)
    [requested_bucket, (requested_bucket&.not_counted? ? nil : registration_policy.anything_bucket)].compact
  end

  def prioritized_buckets_without_requested_bucket
    registration_policy
      .buckets
      .select(&:counted?)
      .select(&:slots_limited?)
      .sort_by { |bucket| bucket.anything? ? 0 : 1 }
  end
end
