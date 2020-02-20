class RegistrationPolicy::Bucket
  include ActiveModel::Model
  include ActiveModel::Serializers::JSON

  attr_reader :key
  attr_accessor :name, :description, :minimum_slots, :preferred_slots, :total_slots,
    :slots_limited, :anything, :not_counted, :expose_attendees
  alias slots_limited? slots_limited
  alias anything? anything
  alias not_counted? not_counted
  alias expose_attendees? expose_attendees

  def self.normalize_key(key)
    key.to_s.downcase.gsub(/[^0-9a-z]/, '_')
  end

  %w[minimum_slots preferred_slots total_slots].each do |method|
    define_method method do
      instance_variable_get(:"@#{method}") || 0
    end
  end

  def slots_unlimited=(value)
    self.slots_limited = !value
  end

  def slots_unlimited?
    !slots_limited?
  end

  def counted?
    !not_counted?
  end

  def key=(key)
    @key = self.class.normalize_key(key)
  end

  def full?(signups)
    available_slots(signups) == 0
  end

  def has_available_slots?(signups)
    slots_unlimited? || available_slots(signups) > 0
  end

  def available_slots(signups)
    return nil if slots_unlimited?
    my_signups_count = signups.count { |signup| signup.confirmed? && signup.bucket_key == key }
    [total_slots - my_signups_count, 0].max
  end

  def errors_for_signup(_signup, _other_signups)
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
      slots_limited: slots_limited,
      anything: anything,
      not_counted: not_counted,
      expose_attendees: expose_attendees
    }
  end

  def metadata
    {
      key: key,
      name: name,
      description: description
    }
  end

  def ==(other)
    attributes == other.attributes
  end

  delegate :hash, to: :attributes

  def to_liquid
    RegistrationPolicy::BucketDrop.new(self)
  end
end
