# A RegistrationPolicy manages the specific signup requirements for a particular Event.  It consists of one or
# more "buckets", each of which can accept signups.  Buckets can restrict signups based on particular filters
# (e.g. age, gender, payment status) and can limit signups to a particular number if they choose to.
class RegistrationPolicy
  def buckets
    []
  end
  
  def bucket_with_key(key)
    key = RegistrationPolicy::Bucket.normalize_key(key)
    buckets.find { |bucket| bucket.key == key }
  end
  
  def bucket_for_new_signup(signup, other_signups)
    buckets.find { |bucket| bucket.errors_for_signup(signup, other_signups).empty? }
  end
  
  def available_slots_by_bucket(signups)
    signups_by_bucket_key = signups.group_by(&:bucket_key)
    
    buckets.each_with_object({}) do |bucket, hash|
      hash[bucket.key] = bucket.available_slots(signups_by_bucket_key[bucket.key])
    end
  end
end