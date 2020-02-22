class SignupCountPresenter
  include SortBuckets
  include ActionView::Helpers::TextHelper

  attr_reader :run

  # Initializes the signups-by-state-and-bucket hash with empty arrays for each state/bucket
  # combination
  def self.empty_signups_hash(default_value, buckets)
    Signup::STATES.each_with_object({}) do |state, states_hash|
      states_hash[state] = buckets.each_with_object({}) do |bucket, buckets_hash|
        buckets_hash[bucket.key] = default_value.dup
      end
      states_hash[state][nil] = default_value.dup # Some signups are not in any bucket
    end
  end

  def self.effective_bucket_key(state, bucket_key, requested_bucket_key)
    return requested_bucket_key if state == 'waitlisted'
    bucket_key
  end

  def self.process_signup_count_data(buckets, data)
    default_value = { counted: 0, not_counted: 0 }
    signup_count_hash = empty_signups_hash(default_value, buckets)

    data.each do |(state, bucket_key, requested_bucket_key, counted), count|
      hash_bucket_key = effective_bucket_key(state, bucket_key, requested_bucket_key)
      counted_key = counted ? :counted : :not_counted

      signup_count_hash[state][hash_bucket_key] ||= default_value.dup
      signup_count_hash[state][hash_bucket_key][counted_key] ||= 0
      signup_count_hash[state][hash_bucket_key][counted_key] += count
    end

    signup_count_hash
  end

  def self.signup_count_data_for_runs(runs)
    data_with_run_ids = Signup.where(run_id: runs.map(&:id)).group(
      :run_id,
      :state,
      :bucket_key,
      :requested_bucket_key,
      :counted
    ).count

    data_with_run_ids.to_a.group_by { |(key, _)| key.first }.transform_values do |run_data|
      run_data.each_with_object({}) do |((_run_id, *key), value), hash|
        hash[key] = value
      end
    end
  end

  def self.for_runs(runs)
    data_by_run_id = signup_count_data_for_runs(runs)
    runs.each_with_object({}) do |run, hash|
      hash[run.id] = new(
        run,
        count_data: data_by_run_id[run.id] || []
      )
    end
  end

  def initialize(run, count_data: nil)
    @run = run

    return unless count_data
    @signup_count_by_state_and_bucket_key_and_counted =
      SignupCountPresenter.process_signup_count_data(buckets, count_data)
  end

  def signups_description
    [
      "Signed up: #{bucket_descriptions_text('confirmed')}",
      (has_waitlist? ? "Waitlisted: #{bucket_descriptions_text('waitlisted')}" : nil)
    ].compact.join("\n")
  end

  def bucket_descriptions_text(state)
    bucket_descriptions(state).map(&:strip).join(', ')
  end

  def bucket_descriptions(state)
    counted_key = counted_key_for_state(state)
    signups_by_bucket_key = signup_count_by_state_and_bucket_key_and_counted[state]

    if buckets.size == 1
      [signups_by_bucket_key.values.first[counted_key].to_s]
    else
      bucket_texts = buckets.map do |bucket|
        bucket_counted_key = counted_key
        bucket_counted_key = :not_counted if bucket.not_counted?
        "#{bucket.name}: #{signups_by_bucket_key[bucket.key][bucket_counted_key]}"
      end

      if state == 'waitlisted'
        if signups_by_bucket_key[nil] && signups_by_bucket_key[nil][:not_counted] > 0
          bucket_texts << "No preference: #{signups_by_bucket_key[nil][:not_counted]}"
        end
      end

      bucket_texts
    end
  end

  def counted_key_for_state(state)
    return :not_counted if state != 'confirmed' || registration_policy.only_uncounted?
    :counted
  end

  def confirmed_count
    @confirmed_count ||= counted_signups_by_state('confirmed')
  end

  def confirmed_limited_count
    @confirmed_limited_count ||= buckets.select(&:slots_limited?).map do |bucket|
      signup_count_by_state_and_bucket_key_and_counted['confirmed'][bucket.key][:counted]
    end.sum
  end

  # Waitlisted signups are never counted, so count them all here
  def waitlist_count
    @waitlist_count ||= signup_count_by_state_and_bucket_key_and_counted['waitlisted'].values
      .flat_map(&:values).sum
  end

  def confirmed_count_for_bucket(bucket_key)
    signup_count_by_state_and_bucket_key_and_counted['confirmed'][bucket_key][:counted]
  end

  def confirmed_count_for_bucket_including_not_counted(bucket_key)
    signup_count_by_state_and_bucket_key_and_counted['confirmed'][bucket_key].values.sum
  end

  def capacity_fraction_for_bucket(bucket_key)
    bucket = registration_policy.bucket_with_key(bucket_key)
    return 1.0 if bucket.slots_unlimited?
    return 0.0 if bucket.total_slots == 0

    remaining_slots = (
      bucket.total_slots - confirmed_count_for_bucket_including_not_counted(bucket_key)
    )
    remaining_slots.to_f / bucket.total_slots.to_f
  end

  def has_waitlist?
    waitlist_count > 0
  end

  def counted_signups_by_state(state)
    counts_by_bucket_key_and_counted = signup_count_by_state_and_bucket_key_and_counted[state]
    counts_by_bucket_key_and_counted.sum do |_bucket_key, counts_by_counted|
      counts_by_counted[:counted]
    end
  end

  def not_counted_signups_by_state(state)
    counts_by_bucket_key_and_counted = signup_count_by_state_and_bucket_key_and_counted[state]
    counts_by_bucket_key_and_counted.sum do |_bucket_key, counts_by_counted|
      counts_by_counted[:not_counted]
    end
  end

  def signup_count(state: nil, bucket_key: nil, counted: nil)
    bucket_key_and_counted_hashes = begin
      signup_count_by_state_and_bucket_key_and_counted.select do |state_key, _hash|
        state.nil? || state == state_key
      end.values
    end

    counted_hashes = bucket_key_and_counted_hashes.flat_map do |hash|
      hash.select do |bucket_key_key, _hash|
        bucket_key.nil? || bucket_key == bucket_key_key
      end.values
    end

    counts = counted_hashes.flat_map do |hash|
      hash.select do |counted_key, _count|
        counted.nil? || counted == counted_key
      end.values
    end

    counts.sum
  end

  def signup_count_by_state_and_bucket_key_and_counted
    @signup_count_by_state_and_bucket_key_and_counted ||= begin
      data = Signup.where(run_id: run.id)
        .group(:state, :bucket_key, :requested_bucket_key, :counted)
        .count
      SignupCountPresenter.process_signup_count_data(buckets, data)
    end
  end

  # WARNING: This method allocates a LOT of objects; don't use it unless you really need the actual
  # signup models.
  def signups_by_state_and_bucket_key
    @signups_by_state_and_bucket_key ||= begin
      signups_hash = SignupCountPresenter.empty_signups_hash([], buckets)

      run.signups.each do |signup|
        bucket_key = SignupCountPresenter.effective_bucket_key(
          signup.state,
          signup.bucket_key,
          signup.requested_bucket_key
        )

        signups_hash[signup.state][bucket_key] ||= []
        signups_hash[signup.state][bucket_key] << signup
      end

      signups_hash
    end
  end

  def buckets
    @buckets ||= sort_buckets(registration_policy.buckets)
  end

  private

  def registration_policy
    @registration_policy ||= run.registration_policy
  end
end
