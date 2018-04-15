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
    @actual_bucket ||= prioritized_buckets.find do |bucket|
      !bucket.full?(other_signups) || movable_signups_for_bucket(bucket).any?
    end
  end

  def buckets_with_capacity
    @buckets_with_capacity ||= registration_policy.buckets.reject do |bucket|
      bucket.not_counted? || bucket.full?(other_signups)
    end
  end

  def movable_signups_for_bucket(bucket)
    return [] unless allow_movement
    return [] unless buckets_with_capacity.any?

    other_signups.select do |signup|
      signup.bucket_key == bucket.key && !signup.requested_bucket_key
    end
  end

  private

  def prioritized_buckets
    @prioritized_buckets ||= begin
      if requested_bucket_key
        requested_bucket = registration_policy.bucket_with_key(requested_bucket_key)
        [
          requested_bucket,
          (requested_bucket&.not_counted? ? nil : registration_policy.anything_bucket)
        ].compact
      else
        registration_policy.buckets.select(&:counted?).sort_by { |bucket| bucket.anything? ? 0 : 1 }
      end
    end
  end
end
