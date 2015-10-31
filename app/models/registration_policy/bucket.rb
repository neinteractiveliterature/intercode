class RegistrationPolicy::Bucket
  include ActiveModel::Model
  
  attr_accessor :key, :total_slots, :slots_limited
  alias_method :slots_limited?, :slots_limited
  
  def self.normalize_key(key)
    key.to_s.downcase.gsub(/[^0-9a-z]/, '_')
  end
  
  def slots_unlimited=(value)
    self.slots_limited = !value
  end
  
  def slots_unlimited?
    !slots_limited?
  end
  
  def key=(key)
    @key = self.class.normalize_key(key)
  end
  
  def available_slots(signups)
    return nil if slots_unlimited?
    total_slots - signups.size
  end
  
  def errors_for_signup(signup, other_signups)
    []
  end
end