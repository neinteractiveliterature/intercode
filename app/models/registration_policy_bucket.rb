# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: registration_policy_buckets
#
#  id                     :bigint           not null, primary key
#  counted                :boolean          default(TRUE), not null
#  description            :text
#  expose_attendees       :boolean          default(FALSE), not null
#  flex                   :boolean          default(FALSE), not null
#  key                    :string           not null
#  minimum_slots          :integer          default(0), not null
#  name                   :text             not null
#  position               :integer          not null
#  preferred_slots        :integer          default(0), not null
#  slots_limited          :boolean          default(FALSE), not null
#  total_slots            :integer          default(0), not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  registration_policy_id :bigint           not null
#
# Indexes
#
#  idx_on_registration_policy_id_key_b71cb40026                 (registration_policy_id,key) UNIQUE
#  idx_on_registration_policy_id_position_c9150cdc46            (registration_policy_id,position) UNIQUE
#  index_registration_policy_buckets_on_registration_policy_id  (registration_policy_id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
class RegistrationPolicyBucket < ApplicationRecord
  belongs_to :registration_policy, inverse_of: :buckets

  positioned on: :registration_policy

  COMPARABLE_ATTRIBUTES = %w[
    key
    name
    description
    total_slots
    minimum_slots
    preferred_slots
    slots_limited
    flex
    counted
    expose_attendees
  ].freeze

  def self.normalize_key(key)
    key.to_s.downcase.gsub(/[^0-9a-z]/, "_")
  end

  def key=(value)
    super(self.class.normalize_key(value))
  end

  def slots_unlimited?
    !slots_limited?
  end

  def slots_unlimited=(value)
    self.slots_limited = !value
  end

  # External API compatibility: GraphQL calls anything?/not_counted? (it appends the `?` itself),
  # but RegistrationPolicy::BucketDrop's `delegate :anything, :not_counted, to: :bucket` calls the
  # plain, non-predicate names -- so both forms need to exist. Plain methods, not `alias`, because
  # flex?/counted? are generated lazily by AR's attribute-methods module and a class-body `alias`
  # can race that.
  def anything
    flex
  end

  def anything?
    flex?
  end

  def anything=(value)
    self.flex = value
  end

  def not_counted # rubocop:disable Naming/PredicateMethod
    !counted
  end

  def not_counted?
    not_counted
  end

  def not_counted=(value)
    self.counted = !ActiveModel::Type::Boolean.new.cast(value)
  end

  def full?(signups)
    available_slots(signups)&.zero?
  end

  def has_available_slots?(signups) # rubocop:disable Naming/PredicatePrefix
    slots_unlimited? || available_slots(signups).positive?
  end

  def available_slots(signups)
    return nil if slots_unlimited?
    my_signups_count = signups.count { |signup| signup_definitely_occupies_slot_in_bucket?(signup) }
    [total_slots - my_signups_count, 0].max
  end

  # Ported verbatim from the old RegistrationPolicy::Bucket (app/models/registration_policy/bucket.rb)
  #
  # This can be called with a candidate bucket from a detached, not-yet-persisted RegistrationPolicy
  # (e.g. while simulating a registration policy change in EventChangeRegistrationPolicyService),
  # which has no id yet -- see occupies_bucket_as_signup? below for how both cases are handled.
  def signup_definitely_occupies_slot_in_bucket?(signup)
    case signup
    when Signup, SignupBucketFinder::FakeSignup
      occupies_bucket_as_signup?(signup)
    when SignupRequest
      signup.state == "pending" && (id ? signup.requested_bucket_id == id : signup.requested_bucket.equal?(self))
    else
      raise ArgumentError, "RegistrationPolicyBucket doesn't know how to count #{signup.class.name} objects as signups"
    end
  end

  def metadata
    { key:, name:, description: }
  end

  # Hand-curated (not AR's default as_json) to preserve the old external shape -- this JSON is
  # persisted verbatim into FormResponseChange audit records, so keeping anything/not_counted
  # names and omitting registration_policy_id/timestamps avoids a shape discontinuity between
  # historical and newly-created audit rows. id is included (unlike the omitted fields above) so
  # the registration policy editor can round-trip a bucket's id through form_response_attrs_json;
  # see RegistrationPolicy#sync_buckets_from_hash! for why that matters.
  def as_json(_options = {})
    {
      "id" => id,
      "key" => key,
      "name" => name,
      "description" => description,
      "total_slots" => total_slots,
      "minimum_slots" => minimum_slots,
      "preferred_slots" => preferred_slots,
      "slots_limited" => slots_limited,
      "anything" => anything?,
      "not_counted" => not_counted?,
      "expose_attendees" => expose_attendees
    }
  end

  # Deliberately not `==` -- see RegistrationPolicy#equivalent_to? for why.
  def equivalent_to?(other)
    return equivalent_to?(other.bucket) if other.is_a?(RegistrationPolicy::BucketDrop)
    return false unless other.is_a?(RegistrationPolicyBucket)
    COMPARABLE_ATTRIBUTES.all? { |attr| public_send(attr) == other.public_send(attr) }
  end

  def to_liquid
    RegistrationPolicy::BucketDrop.new(self)
  end

  private

  # Fast path when this bucket is persisted: bucket_id (a plain column, real for a Signup and an
  # in-memory delegate to the candidate bucket's id for a FakeSignup) avoids touching the bucket
  # association -- this runs once per signup on every capacity check (Run#full?, the schedule grid,
  # etc.), so an association read per call on a real Signup is a real N+1. Falls back to object
  # identity when this bucket is a detached, not-yet-persisted candidate (id is nil): only a
  # FakeSignup can be "in" such a bucket, by holding a reference to this exact instance.
  def occupies_bucket_as_signup?(signup)
    return false unless signup.occupying_slot? && (not_counted? || signup.counted)
    return signup.bucket_id == id if id
    signup.bucket.equal?(self)
  end
end
