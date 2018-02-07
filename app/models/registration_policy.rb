# A RegistrationPolicy manages the specific signup requirements for a particular Event.  It consists
# of one or more "buckets", each of which can accept signups.  Buckets can limit signups to a
# particular number if they choose to.
class RegistrationPolicy
  include ActiveModel::Model
  include ActiveModel::Serializers::JSON

  validate :validate_anything_bucket, :validate_key_uniqueness

  def self.unlimited
    new(buckets: [RegistrationPolicy::Bucket.new(key: 'unlimited', slots_unlimited: true)])
  end

  attr_reader :buckets

  def initialize(attributes = {})
    super(attributes)
    @buckets ||= []
  end

  def bucket_with_key(key)
    key = RegistrationPolicy::Bucket.normalize_key(key)
    buckets_by_key[key]
  end

  %i[total_slots minimum_slots preferred_slots].each do |method|
    define_method method do
      buckets.map(&method).sum
    end
  end

  def slots_unlimited?
    buckets.any?(&:slots_unlimited?)
  end

  def slots_limited?
    !slots_unlimited?
  end

  def prevent_no_preference_signups
    !!@prevent_no_preference_signups
  end
  alias prevent_no_preference_signups? prevent_no_preference_signups

  def allow_no_preference_signups?
    !prevent_no_preference_signups
  end

  def attributes
    {
      buckets: buckets,
      prevent_no_preference_signups: prevent_no_preference_signups?
    }
  end

  def buckets=(buckets)
    @buckets = buckets.map do |value|
      case value
      when RegistrationPolicy::Bucket then value
      else RegistrationPolicy::Bucket.new(value)
      end
    end

    @buckets_by_key = nil
    @anything_bucket = nil
  end

  def prevent_no_preference_signups=(value)
    @prevent_no_preference_signups = !!value
  end

  def attributes=(attributes)
    attributes.each do |key, value|
      case key.to_sym
      when :buckets then self.buckets = value
      when :prevent_no_preference_signups then self.prevent_no_preference_signups = value
      else raise ActiveModel::MissingAttributeError.new("No attribute called #{key.inspect}", key)
      end
    end
  end
  alias assign_attributes attributes=

  def buckets_by_key
    @buckets_by_key ||= buckets.index_by(&:key)
  end

  def anything_bucket
    @anything_bucket ||= buckets.find(&:anything?)
  end

  private

  def validate_anything_bucket
    anything_buckets = buckets.select(&:anything?)

    return unless anything_buckets.size > 1
    errors.add(
      :buckets,
      "can contain at most 1 flex bucket, but there are #{anything_buckets.size}"
    )
  end

  def validate_key_uniqueness
    buckets.group_by(&:key).each do |key, buckets|
      next unless buckets.size > 1
      errors.add(:buckets, "has #{buckets.size} buckets with the key #{key.inspect}")
    end
  end
end
