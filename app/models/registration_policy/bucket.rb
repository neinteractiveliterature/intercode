class RegistrationPolicy::Bucket
  attr_accessor :total_slots
  attr_reader :key
  
  def self.normalize_key(key)
    key.to_s.downcase.gsub(/[^0-9a-z]/, '_')
  end
  
  def initialize(key)
    @key = self.class.normalize_key(key)
  end
  
  def slots_limited?
    !total_slots.nil?
  end
  
  def slots_unlimited?
    !slots_limited?
  end
  
  def unlimited!
    self.total_slots = nil
  end
  
  def available_slots(signups)
    return nil if slots_unlimited?
    total_slots - signups.size
  end
  
  def errors_for_signup(signup, other_signups)
    []
  end
end