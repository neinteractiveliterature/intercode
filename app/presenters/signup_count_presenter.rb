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

    if registration_policy.buckets.size == 1
      [signups_by_bucket_key.values.first.size.to_s]
    else
      registration_policy.buckets.map do |bucket|
        "#{bucket.name}: #{signups_by_bucket_key[bucket.key].size}"
      end
    end
  end

  def waitlist_count
    @waitlist_count ||= run.signups.counted.waitlisted.count
  end

  def has_waitlist?
    waitlist_count > 0
  end

  private

  def signups_by_state_and_bucket_key
    @signups_by_state_and_bucket_key ||= begin
      signups_hash = empty_signups_hash

      run.signups.counted.each do |signup|
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

  # Initializes the signups-by-state-and-bucket hash with empty arrays for each state/bucket combination
  def empty_signups_hash
    Signup::STATES.each_with_object({}) do |state, states_hash|
      states_hash[state] = registration_policy.buckets.each_with_object({}) do |bucket, buckets_hash|
        buckets_hash[bucket.key] = []
      end
    end
  end

  def registration_policy
    @registration_policy ||= run.registration_policy
  end
end