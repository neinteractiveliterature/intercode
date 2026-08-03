# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: registration_policies
#
#  id                            :bigint           not null, primary key
#  freeze_no_preference_buckets  :boolean          default(FALSE), not null
#  prevent_no_preference_signups :boolean          default(FALSE), not null
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

# A RegistrationPolicy manages the specific signup requirements for a particular Event.  It consists
# of one or more "buckets", each of which can accept signups.  Buckets can limit signups to a
# particular number if they choose to.
class RegistrationPolicy < ApplicationRecord
  has_many :buckets,
           -> { order(:position) },
           class_name: "RegistrationPolicyBucket",
           inverse_of: :registration_policy,
           dependent: :destroy
  # :nullify avoids blocking an event's own destroy cascade.
  has_many :events, inverse_of: :registration_policy, dependent: :nullify
  has_many :event_proposals, inverse_of: :registration_policy, dependent: :nullify

  validate :validate_flex_bucket_uniqueness, :validate_bucket_key_uniqueness

  def self.unlimited
    new(
      buckets: [
        RegistrationPolicyBucket.new(
          key: "unlimited",
          name: "Signups",
          description: "Signups for this event",
          slots_limited: false
        )
      ]
    )
  end

  # Explicit builder for hash-based construction (GraphQL args, import data) -- deliberately not
  # hooked into `new`/`assign_attributes`.
  IGNORED_HASH_KEYS = %w[__typename id created_at updated_at].freeze

  def self.build_from_hash(hash)
    # Strip __typename (an Apollo Client cache-normalization artifact) and id/created_at/updated_at
    # (would let this detached policy alias a real persisted row).
    hash = hash.to_h.stringify_keys.except(*IGNORED_HASH_KEYS)
    bucket_hashes = hash.delete("buckets") || []
    new(hash).tap do |policy|
      policy.buckets =
        bucket_hashes.each_with_index.map do |bucket_hash, index|
          RegistrationPolicyBucket.new(
            bucket_hash.to_h.stringify_keys.except(*IGNORED_HASH_KEYS).merge("position" => index + 1)
          )
        end
    end
  end

  def bucket_with_key(key)
    normalized_key = RegistrationPolicyBucket.normalize_key(key)
    buckets.find { |bucket| bucket.key == normalized_key }
  end

  def bucket_with_id(id)
    buckets.find { |bucket| bucket.id == id }
  end

  # Applies another (typically detached, e.g. built via .build_from_hash) policy's values onto
  # this persisted one in place. Shared by EventChangeRegistrationPolicyService (after signup
  # simulation succeeds) and EventProposal's update path, which otherwise duplicated this exact
  # pair of calls.
  def update_from!(other)
    update!(
      prevent_no_preference_signups: other.prevent_no_preference_signups,
      freeze_no_preference_buckets: other.freeze_no_preference_buckets
    )
    sync_buckets_from_hash!(other.buckets.map(&:attributes))
  end

  # Matches buckets by key (never rewritten in place); destroys removed keys before
  # creating/updating the rest to avoid a transient key collision (positions are reassigned safely
  # by the `positioned` gem, so no equivalent care is needed there). Caller wraps this in a
  # transaction. This key-based matching is about this API's own write-identity model, not
  # signups' bucket_key -- it isn't resolved by the deferred bucket_key->FK conversion on signups
  # unless that work also redesigns this API around ids.
  def sync_buckets_from_hash!(bucket_hashes)
    bucket_hashes = bucket_hashes.map { |hash| hash.to_h.stringify_keys }
    desired_keys = bucket_hashes.map { |hash| RegistrationPolicyBucket.normalize_key(hash["key"]) }
    existing_by_key = buckets.index_by(&:key)

    existing_by_key.except(*desired_keys).each_value(&:destroy!)

    bucket_hashes.each_with_index do |hash, index|
      normalized_key = RegistrationPolicyBucket.normalize_key(hash["key"])
      attrs = hash.except("id", "registration_policy_id", "created_at", "updated_at").merge("position" => index + 1)
      existing = existing_by_key[normalized_key]

      existing ? existing.update!(attrs.except("key")) : buckets.create!(attrs)
    end

    # The destroys above happened directly on the fetched records, not through the association
    # itself, so the association's cached target array doesn't know about them -- it would keep
    # serving the stale (now-destroyed) records alongside anything newly created. Reset it so the
    # next read re-queries fresh.
    buckets.reset
  end

  %i[total_slots minimum_slots preferred_slots].each do |method|
    define_method method do
      buckets.select(&:counted?).sum { |bucket| bucket.public_send(method) }
    end

    define_method :"#{method}_including_not_counted" do
      buckets.sum { |bucket| bucket.public_send(method) }
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

  def allow_no_preference_signups?
    !prevent_no_preference_signups?
  end

  def anything_bucket
    buckets.find(&:anything?)
  end

  def blank?
    buckets.none?
  end

  # Hand-curated (not AR's default as_json) to preserve the old external shape -- AR's default
  # would include id/created_at/updated_at, which would round-trip back through build_from_hash
  # and cause the "detached" policy it builds to carry the SAME id as a real persisted row
  # (new(hash) accepts an explicit id), corrupting association/dirty-tracking behavior on what's
  # supposed to be a genuinely separate, unsaved object.
  def as_json(options = {})
    {
      "prevent_no_preference_signups" => prevent_no_preference_signups,
      "freeze_no_preference_buckets" => freeze_no_preference_buckets,
      "buckets" => buckets.map { |bucket| bucket.as_json(options) }
    }
  end

  # Deliberately not `==` -- avoids silently changing assert_equal/Array#include?/case-when/uniq
  # semantics everywhere.
  def equivalent_to?(other)
    return false unless other.is_a?(RegistrationPolicy)
    return false unless prevent_no_preference_signups? == other.prevent_no_preference_signups?
    return false unless freeze_no_preference_buckets? == other.freeze_no_preference_buckets?
    return false unless buckets.size == other.buckets.size

    buckets.all? { |bucket| bucket.equivalent_to?(other.bucket_with_key(bucket.key)) }
  end

  private

  def validate_flex_bucket_uniqueness
    flex_buckets = buckets.reject(&:marked_for_destruction?).select(&:anything?)

    return unless flex_buckets.size > 1
    errors.add(:buckets, "can contain at most 1 flex bucket, but there are #{flex_buckets.size}")
  end

  def validate_bucket_key_uniqueness
    buckets
      .reject(&:marked_for_destruction?)
      .group_by(&:key)
      .each do |key, group|
        next unless group.size > 1
        errors.add(:buckets, "has #{group.size} buckets with the key #{key.inspect}")
      end
  end
end
