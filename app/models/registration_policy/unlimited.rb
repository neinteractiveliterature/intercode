class RegistrationPolicy::Unlimited < RegistrationPolicy
  def buckets
    @buckets ||= begin
      bucket = Bucket.new("Unlimited")
      bucket.unlimited!
      [bucket]
    end
  end
end