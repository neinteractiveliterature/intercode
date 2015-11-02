class RegistrationPolicy::Unlimited < RegistrationPolicy
  def buckets
    @buckets ||= [Bucket.new(key: "unlimited", slots_unlimited: true)]
  end
end