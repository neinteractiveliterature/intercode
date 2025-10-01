# frozen_string_literal: true
# A RegistrationPolicy manages the specific signup requirements for a particular Event.  It consists
# of one or more "buckets", each of which can accept signups.  Buckets can limit signups to a
# particular number if they choose to.
class RegistrationPolicy
  include ActiveModel::Model
  include ActiveModel::Serializers::JSON

  validate :validate_anything_bucket, :validate_key_uniqueness

  def self.unlimited
    new(
      buckets: [
        RegistrationPolicy::Bucket.new(
          key: "unlimited",
          name: "Signups",
          description: "Signups for this event",
          slots_limited: false
        )
      ]
    )
  end

  attr_reader :buckets

  def initialize(attributes = {})
    super
    @buckets ||= []
  end

  def bucket_with_key(key)
    key = RegistrationPolicy::Bucket.normalize_key(key)
    buckets_by_key[key]
  end

  %i[total_slots minimum_slots preferred_slots].each do |method|
    define_method method do
      buckets.select(&:counted?).sum(&method)
    end

    define_method :"#{method}_including_not_counted" do
      buckets.sum(&method)
    end
  end

  def accepts_signups?
    slots_unlimited? || total_slots_including_not_counted.positive?
  end

  def slots_unlimited?
    buckets.any? { |bucket| bucket.slots_unlimited? && (bucket.counted? || only_uncounted?) }
  end

  def slots_limited?
    !slots_unlimited?
  end

  def only_uncounted?
    buckets.none?(&:counted?)
  end

  def prevent_no_preference_signups # rubocop:disable Naming/PredicateMethod
    !!@prevent_no_preference_signups
  end
  alias prevent_no_preference_signups? prevent_no_preference_signups

  def allow_no_preference_signups?
    !prevent_no_preference_signups
  end

  def freeze_no_preference_buckets # rubocop:disable Naming/PredicateMethod
    !!@freeze_no_preference_buckets
  end
  alias freeze_no_preference_buckets? freeze_no_preference_buckets

  def attributes
    {
      buckets:,
      prevent_no_preference_signups: prevent_no_preference_signups?,
      freeze_no_preference_buckets: freeze_no_preference_buckets?
    }
  end

  def buckets=(buckets)
    @buckets =
      buckets.map do |value|
        case value
        when RegistrationPolicy::Bucket
          value
        else
          RegistrationPolicy::Bucket.new(value)
        end
      end

    @buckets_by_key = nil
    @anything_bucket = nil
  end

  def prevent_no_preference_signups=(value)
    @prevent_no_preference_signups = !!value
  end

  def freeze_no_preference_buckets=(value)
    @freeze_no_preference_buckets = !!value
  end

  def attributes=(attributes)
    attributes.each do |key, value|
      case key.to_sym
      when :buckets
        self.buckets = value
      when :prevent_no_preference_signups
        self.prevent_no_preference_signups = value
      when :freeze_no_preference_buckets
        self.freeze_no_preference_buckets = value
      when :__typename
        next
      else
        raise ActiveModel::MissingAttributeError.new("No attribute called #{key.inspect}", key)
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

  def ==(other)
    return self == RegistrationPolicy.new(other) if other.is_a?(Hash)
    return self == other.to_unsafe_h if other.is_a?(ActionController::Parameters)
    return false unless other.is_a?(RegistrationPolicy)
    return false unless prevent_no_preference_signups == other.prevent_no_preference_signups
    return false unless freeze_no_preference_buckets == other.freeze_no_preference_buckets
    return false unless buckets.size == other.buckets.size

    buckets.all? { |bucket| bucket == other.bucket_with_key(bucket.key) }
  end

  def as_json(*)
    super.merge(buckets: buckets.as_json(*))
  end

  def blank?
    buckets.none?
  end

  private

  def validate_anything_bucket
    anything_buckets = buckets.select(&:anything?)

    return unless anything_buckets.size > 1
    errors.add(:buckets, "can contain at most 1 flex bucket, but there are #{anything_buckets.size}")
  end

  def validate_key_uniqueness
    buckets
      .group_by(&:key)
      .each do |key, buckets|
        next unless buckets.size > 1
        errors.add(:buckets, "has #{buckets.size} buckets with the key #{key.inspect}")
      end
  end
end
