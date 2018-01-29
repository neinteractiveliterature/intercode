class SignupCountPresenter
  attr_reader :run

  def initialize(run)
    @run = run
  end

  def signups_description
    [
      "Signed up: #{bucket_descriptions_text('confirmed')}",
      (has_waitlist? ? "Waitlisted: #{bucket_descriptions_text('waitlisted')}" : nil)
    ].compact.join("\n")
  end

  def bucket_descriptions_text(state)
    bucket_descriptions(state).map(&:strip).join(", ")
  end

  def bucket_descriptions(state)
    signups_by_bucket_key = signups_by_state_and_bucket_key[state]

    if buckets.size == 1
      [signups_by_bucket_key.values.first.size.to_s]
    else
      buckets.map do |bucket|
        "#{bucket.name}: #{signups_by_bucket_key[bucket.key].size}"
      end
    end
  end

  def confirmed_count
    @confirmed_count ||= signups_by_state_and_bucket_key['confirmed'].values.map(&:size).sum
  end

  def waitlist_count
    @waitlist_count ||= signups_by_state_and_bucket_key['waitlisted'].values.map(&:size).sum
  end

  def confirmed_count_for_bucket(bucket_key)
    signups_by_state_and_bucket_key['confirmed'][bucket_key]&.size || 0
  end

  def capacity_fraction_for_bucket(bucket_key)
    bucket = registration_policy.bucket_with_key(bucket_key)
    return 1.0 if bucket.slots_unlimited?
    return 0.0 if bucket.total_slots == 0

    (bucket.total_slots - confirmed_count_for_bucket(bucket_key)).to_f / bucket.total_slots.to_f
  end

  def capacity_description_for_bucket(bucket_key)
    bucket = registration_policy.bucket_with_key(bucket_key)
    return "unlimited" if bucket.slots_unlimited?

    remaining_capacity = bucket.total_slots - confirmed_count_for_bucket(bucket_key)
    "#{remaining_capacity} / #{bucket.total_slots} available"
  end

  def has_waitlist?
    waitlist_count > 0
  end

  def counted_signups_by_state(state)
    signups_by_state_and_bucket_key[state].values.flatten
  end

  def signups_by_state_and_bucket_key
    @signups_by_state_and_bucket_key ||= begin
      signups_hash = empty_signups_hash

      run.signups.select(&:counted?).each do |signup|
        bucket_key = if signup.waitlisted?
          signup.requested_bucket_key
        else
          signup.bucket_key
        end

        signups_hash[signup.state][bucket_key] << signup
      end

      signups_hash
    end
  end

  def buckets
    @buckets ||= registration_policy.buckets.sort_by { |bucket| [bucket.anything? ? 1 : 0, bucket.name.downcase] }
  end

  private

  # Initializes the signups-by-state-and-bucket hash with empty arrays for each state/bucket combination
  def empty_signups_hash
    Signup::STATES.each_with_object({}) do |state, states_hash|
      states_hash[state] = buckets.each_with_object({}) do |bucket, buckets_hash|
        buckets_hash[bucket.key] = []
      end
      states_hash[state][nil] = []  # Some signups are not in any bucket
    end
  end

  def registration_policy
    @registration_policy ||= run.registration_policy
  end
end
