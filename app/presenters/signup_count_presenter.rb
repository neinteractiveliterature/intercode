class SignupCountPresenter
  attr_reader :run

  def initialize(run)
    @run = run
  end

  def confirmed_bucket_descriptions
    if registration_policy.buckets.size == 1
      [confirmed_signups_by_bucket_key.values.first.size.to_s]
    else
      registration_policy.buckets.map do |bucket|
        "#{bucket.name}: #{confirmed_signups_by_bucket_key[bucket.key].size}"
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

  def confirmed_signups_by_bucket_key
    @confirmed_signups_by_bucket_key ||= run.signups.counted.confirmed.to_a.group_by(&:bucket_key).tap do |hash|
      (registration_policy.buckets.map(&:key) + [nil]).each do |bucket_key|
        hash[bucket_key] ||= []
      end
    end
  end

  def registration_policy
    @registration_policy ||= run.registration_policy
  end
end