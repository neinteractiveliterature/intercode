class RegistrationPolicy::Bucket
  include ActiveModel::Model
  include ActiveModel::Serializers::JSON

  attr_accessor :key, :name, :description, :minimum_slots, :preferred_slots, :total_slots, :slots_limited
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

  def full?(signups)
    available_slots(signups) == 0
  end

  def has_available_slots?(signups)
    available_slots(signups) > 0
  end

  def available_slots(signups)
    return nil if slots_unlimited?
    [total_slots - signups.size, 0].max
  end

  def errors_for_signup(signup, other_signups)
    []
  end

  def attributes
    {
      key: key,
      name: name,
      description: description,
      total_slots: total_slots,
      minimum_slots: minimum_slots,
      preferred_slots: preferred_slots,
      slots_limited: slots_limited
    }
  end

  def metadata
    {
      key: key,
      name: name,
      description: description
    }
  end

  def ==(bucket)
    attributes == bucket.attributes
  end

  def hash
    attributes.hash
  end
end