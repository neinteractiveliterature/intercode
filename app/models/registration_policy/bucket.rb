# frozen_string_literal: true
class RegistrationPolicy::Bucket
  include ActiveModel::Model
  include ActiveModel::Serializers::JSON

  attr_reader :key
  attr_accessor :name,
                :description,
                :minimum_slots,
                :preferred_slots,
                :total_slots,
                :slots_limited,
                :anything,
                :not_counted,
                :expose_attendees
  alias slots_limited? slots_limited
  alias anything? anything
  alias not_counted? not_counted
  alias expose_attendees? expose_attendees

  def self.normalize_key(key)
    key.to_s.downcase.gsub(/[^0-9a-z]/, "_")
  end

  %w[minimum_slots preferred_slots total_slots].each do |method|
    define_method method do
      instance_variable_get(:"@#{method}") || 0
    end
  end

  def __typename=(value)
    # These can come in from parsed form_response_values_json built from GraphQL responses,
    # but shouldn't actually wind up in the database
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
    available_slots(signups)&.zero?
  end

  def has_available_slots?(signups)
    slots_unlimited? || available_slots(signups).positive?
  end

  def available_slots(signups)
    return nil if slots_unlimited?
    my_signups_count = signups.count { |signup| signup_definitely_occupies_slot_in_bucket?(signup) }
    [total_slots - my_signups_count, 0].max
  end

  def signup_definitely_occupies_slot_in_bucket?(signup)
    case signup
    when Signup, SignupBucketFinder::FakeSignup
      signup.occupying_slot? && signup.bucket_key == key &&
        (
          not_counted? || signup.counted # don't count non-counted signups in a counted bucket
        )
    when SignupRequest
      signup.state == "pending" && signup.requested_bucket_key == key
    else
      raise ArgumentError,
            "RegistrationPolicy::Bucket doesn't know how to count #{signup.class.name} objects as signups"
    end
  end

  def errors_for_signup(_signup, _other_signups)
    []
  end

  def attributes
    {
      key:,
      name:,
      description:,
      total_slots:,
      minimum_slots:,
      preferred_slots:,
      slots_limited:,
      anything:,
      not_counted:,
      expose_attendees:
    }
  end

  def metadata
    { key:, name:, description: }
  end

  def ==(other)
    case other
    when RegistrationPolicy::BucketDrop then self == other.bucket
    else attributes == other&.attributes
    end
  end

  delegate :hash, to: :attributes

  def to_liquid
    RegistrationPolicy::BucketDrop.new(self)
  end
end
