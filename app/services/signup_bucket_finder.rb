class SignupBucketFinder
  attr_reader :registration_policy, :other_signups, :requested_bucket_key,
    :allow_movement

  def initialize(registration_policy, requested_bucket_key, other_signups, allow_movement: true)
    @registration_policy = registration_policy
    @requested_bucket_key = requested_bucket_key
    @other_signups = other_signups
    @allow_movement = allow_movement
  end

  def find_bucket
    @actual_bucket ||= begin
      # try not to bump people out of their signup buckets...
      prioritized_buckets_with_capacity.first ||
        # but do it if you have to
        prioritized_buckets.find { |bucket| movable_signups_for_bucket(bucket).any? }
    end
  end

  def movable_signups_for_bucket(bucket)
    return [] unless allow_movement
    return [] unless no_preference_bucket_finder.prioritized_buckets_with_capacity.any?

    other_signups.select do |signup|
      signup.bucket_key == bucket.key && !signup.requested_bucket_key
    end
  end

  def prioritized_buckets
    @prioritized_buckets ||= begin
      if requested_bucket_key
        requested_bucket = registration_policy.bucket_with_key(requested_bucket_key)
        [
          requested_bucket,
          (requested_bucket&.not_counted? ? nil : registration_policy.anything_bucket)
        ].compact
      else
        registration_policy.buckets.select(&:counted?).select(&:slots_limited?).sort_by do |bucket|
          bucket.anything? ? 0 : 1
        end
      end
    end
  end

  def prioritized_buckets_with_capacity
    @prioritized_buckets_with_capacity ||= prioritized_buckets.reject do |bucket|
      bucket.full?(other_signups)
    end
  end

  def prioritized_buckets_with_capacity_except(*buckets)
    bucket_keys = buckets.map(&:key)
    prioritized_buckets_with_capacity.reject { |bucket| bucket_keys.include?(bucket.key) }
  end

  def no_preference_bucket_finder
    SignupBucketFinder.new(
      registration_policy,
      nil,
      other_signups,
      allow_movement: allow_movement
    )
  end
end
