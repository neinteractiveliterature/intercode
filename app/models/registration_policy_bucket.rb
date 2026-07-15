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

  # Reuses this codebase's existing convention for an ordered-list-within-a-scope column (see
  # SignupRankedChoice's `positioned on: %i[user_con_profile state], column: :priority`), rather
  # than hand-rolling position management. Scope is inferred from the belongs_to; column
  # defaults to `position`, matching our column name.
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
      raise ArgumentError, "RegistrationPolicyBucket doesn't know how to count #{signup.class.name} objects as signups"
    end
  end

  def metadata
    { key:, name:, description: }
  end

  # Hand-curated (not AR's default as_json) to preserve the old external shape -- this JSON is
  # persisted verbatim into FormResponseChange audit records, so keeping anything/not_counted
  # names and omitting id/registration_policy_id/timestamps avoids a shape discontinuity
  # between historical and newly-created audit rows.
  def as_json(_options = {})
    {
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

  # Explicit value-equality check, deliberately NOT `==` -- see RegistrationPolicy#equivalent_to?
  # for the rationale (overriding `==` reaches implicitly into assert_equal, Array#include?,
  # case/when, uniq, etc).
  def equivalent_to?(other)
    return equivalent_to?(other.bucket) if other.is_a?(RegistrationPolicy::BucketDrop)
    return false unless other.is_a?(RegistrationPolicyBucket)
    COMPARABLE_ATTRIBUTES.all? { |attr| public_send(attr) == other.public_send(attr) }
  end

  def to_liquid
    RegistrationPolicy::BucketDrop.new(self)
  end
end
