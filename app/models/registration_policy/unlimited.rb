class RegistrationPolicy::Unlimited < RegistrationPolicy
  def buckets
    @buckets ||= begin
      bucket = Bucket.new(key: "unlimited", slots_unlimited: true)
      [bucket]
    end
  end
end