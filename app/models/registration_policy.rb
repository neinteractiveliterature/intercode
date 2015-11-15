# A RegistrationPolicy manages the specific signup requirements for a particular Event.  It consists of one or
# more "buckets", each of which can accept signups.  Buckets can restrict signups based on particular filters
# (e.g. age, gender, payment status) and can limit signups to a particular number if they choose to.
class RegistrationPolicy
  include ActiveModel::Model
  include ActiveModel::Serializers::JSON
  extend ActsAsCoder

  def self.unlimited
    new(buckets: [RegistrationPolicy::Bucket.new(key: "unlimited", slots_unlimited: true)])
  end

  attr_accessor :buckets

  def initialize(attributes = {})
    super(attributes)
    @buckets ||= []
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

  %i(total_slots minimum_slots preferred_slots).each do |method|
    define_method method do
      buckets.map(&method).sum
    end
  end

  def attributes
    {
      buckets: buckets
    }
  end

  def buckets=(buckets)
    @buckets = buckets.map do |value|
      case value
      when RegistrationPolicy::Bucket then value
      else RegistrationPolicy::Bucket.new(value)
      end
    end
  end

  def attributes=(attributes)
    attributes.each do |key, value|
      case key.to_sym
      when :buckets then self.buckets = value
      else raise ActiveModel::MissingAttributeError.new("No attribute called #{key.inspect}", key)
      end
    end
  end
  alias_method :assign_attributes, :attributes=
end