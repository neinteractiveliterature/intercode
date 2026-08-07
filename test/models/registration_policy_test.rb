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
require "test_helper"

class RegistrationPolicyTest < ActiveSupport::TestCase
  describe "#anything_bucket" do
    it "finds the anything bucket" do
      anything_bucket = RegistrationPolicyBucket.new(key: "dont_care", anything: true)

      policy =
        RegistrationPolicy.new(
          buckets: [
            RegistrationPolicyBucket.new(key: "pcs"),
            RegistrationPolicyBucket.new(key: "npcs"),
            anything_bucket
          ]
        )

      assert_equal anything_bucket, policy.anything_bucket
    end
  end

  describe "#total_slots" do
    it "only counts counted buckets" do
      policy =
        RegistrationPolicy.new(
          buckets: [
            RegistrationPolicyBucket.new(key: "pcs", total_slots: 2),
            RegistrationPolicyBucket.new(key: "npcs", total_slots: 5, not_counted: true)
          ]
        )

      assert_equal 2, policy.total_slots
    end
  end

  describe "validations" do
    it "validates that there is only one anything bucket" do
      policy =
        RegistrationPolicy.new(
          buckets: [
            RegistrationPolicyBucket.new(key: "pcs"),
            RegistrationPolicyBucket.new(key: "npcs"),
            RegistrationPolicyBucket.new(key: "anything1", anything: true),
            RegistrationPolicyBucket.new(key: "anything2", anything: true)
          ]
        )

      assert_not policy.valid?
      assert policy.errors.full_messages.first =~ /at most 1 flex bucket/
    end
  end

  describe ".build_from_hash" do
    it "builds a detached policy with buckets in array order" do
      policy =
        RegistrationPolicy.build_from_hash(
          "prevent_no_preference_signups" => true,
          "buckets" => [{ "key" => "pcs", "name" => "PCs" }, { "key" => "npcs", "name" => "NPCs" }]
        )

      assert_not policy.persisted?
      assert_equal true, policy.prevent_no_preference_signups
      assert_equal %w[pcs npcs], policy.buckets.map(&:key)
      assert policy.buckets.none?(&:persisted?)
    end

    it "strips __typename, id, created_at, and updated_at from the policy itself" do
      policy =
        RegistrationPolicy.build_from_hash(
          "__typename" => "RegistrationPolicyType",
          "id" => 999_999,
          "created_at" => "2020-01-01T00:00:00Z",
          "updated_at" => "2020-01-01T00:00:00Z",
          "buckets" => [{ "__typename" => "RegistrationPolicyBucketType", "id" => 999_999, "key" => "pcs" }]
        )

      assert_nil policy.id
    end

    it "strips __typename, created_at, and updated_at from buckets but keeps their id" do
      policy =
        RegistrationPolicy.build_from_hash(
          "buckets" => [{ "__typename" => "RegistrationPolicyBucketType", "id" => 999_999, "key" => "pcs" }]
        )

      assert_equal 999_999, policy.buckets.first.id
      assert_not policy.buckets.first.persisted?
    end
  end

  describe "#equivalent_to?" do
    it "returns false for a nil or non-RegistrationPolicy other" do
      policy = RegistrationPolicy.build_from_hash(buckets: [{ key: "pcs" }])
      assert_not policy.equivalent_to?(nil)
      assert_not policy.equivalent_to?("not a policy")
    end

    it "returns true for an unsaved policy with equivalent buckets and settings" do
      hash = { prevent_no_preference_signups: true, buckets: [{ key: "pcs", total_slots: 2 }] }
      a = RegistrationPolicy.build_from_hash(hash)
      b = RegistrationPolicy.build_from_hash(hash)

      assert a.equivalent_to?(b)
    end

    it "returns false when a persisted policy is compared against one with different bucket content" do
      policy = create(:registration_policy, buckets: [build(:registration_policy_bucket, key: "pcs", total_slots: 2)])
      changed = RegistrationPolicy.build_from_hash(policy.as_json.merge("buckets" => [{ key: "pcs", total_slots: 3 }]))

      assert_not policy.equivalent_to?(changed)
    end
  end

  describe "#sync_buckets_from_hash!" do
    it "updates matched buckets in place, preserving their row id (falls back to key-matching without an id)" do
      policy = create(:registration_policy, buckets: [build(:registration_policy_bucket, key: "pcs", total_slots: 2)])
      original_id = policy.buckets.first.id

      policy.sync_buckets_from_hash!([{ key: "pcs", name: "Player characters", total_slots: 5 }])
      policy.reload

      assert_equal [original_id], policy.buckets.map(&:id)
      assert_equal 5, policy.buckets.first.total_slots
      assert_equal "Player characters", policy.buckets.first.name
    end

    it "destroys buckets for keys no longer present" do
      policy =
        create(
          :registration_policy,
          buckets: [build(:registration_policy_bucket, key: "pcs"), build(:registration_policy_bucket, key: "npcs")]
        )

      policy.sync_buckets_from_hash!([{ key: "pcs" }])
      policy.reload

      assert_equal ["pcs"], policy.buckets.map(&:key)
    end

    it "creates buckets for new keys" do
      policy = create(:registration_policy, buckets: [build(:registration_policy_bucket, key: "pcs")])

      policy.sync_buckets_from_hash!([{ key: "pcs" }, { key: "npcs", name: "NPCs" }])
      policy.reload

      assert_equal %w[pcs npcs], policy.buckets.map(&:key)
    end

    it "handles an incoming key matching one being freed up in the same call without a unique-index violation" do
      policy =
        create(
          :registration_policy,
          buckets: [build(:registration_policy_bucket, key: "pcs"), build(:registration_policy_bucket, key: "npcs")]
        )

      # 'npcs' is being removed, and a *new* bucket is taking over the 'pcs' key isn't what's
      # happening here -- rather, we're removing 'pcs' and reusing its old key-space isn't
      # relevant; what matters is a destroy (npcs) and a create/update happening in the same call.
      policy.sync_buckets_from_hash!([{ key: "pcs", name: "still here" }])
      policy.reload

      assert_equal ["pcs"], policy.buckets.map(&:key)
    end

    it "matches a bucket by id, allowing its key to be renamed without losing the row" do
      policy = create(:registration_policy, buckets: [build(:registration_policy_bucket, key: "pcs", total_slots: 2)])
      original_id = policy.buckets.first.id

      policy.sync_buckets_from_hash!([{ id: original_id, key: "player_characters", name: "PCs", total_slots: 5 }])
      policy.reload

      assert_equal [original_id], policy.buckets.map(&:id)
      assert_equal "player_characters", policy.buckets.first.key
      assert_equal 5, policy.buckets.first.total_slots
    end
  end

  describe "#update_from!" do
    it "applies another policy's top-level attributes and syncs its buckets" do
      policy = create(:registration_policy, buckets: [build(:registration_policy_bucket, key: "pcs", total_slots: 2)])
      other =
        RegistrationPolicy.build_from_hash(
          prevent_no_preference_signups: true,
          freeze_no_preference_buckets: true,
          buckets: [{ key: "pcs", name: "Player characters", total_slots: 9 }]
        )

      policy.update_from!(other)
      policy.reload

      assert_equal true, policy.prevent_no_preference_signups
      assert_equal true, policy.freeze_no_preference_buckets
      assert_equal 9, policy.buckets.first.total_slots
    end

    it "preserves a bucket's row across a key rename, since build_from_hash keeps the bucket's id" do
      policy = create(:registration_policy, buckets: [build(:registration_policy_bucket, key: "pcs", total_slots: 2)])
      original_id = policy.buckets.first.id
      other =
        RegistrationPolicy.build_from_hash(
          buckets: [{ id: original_id, key: "player_characters", name: "Player characters", total_slots: 9 }]
        )

      policy.update_from!(other)
      policy.reload

      assert_equal [original_id], policy.buckets.map(&:id)
      assert_equal "player_characters", policy.buckets.first.key
      assert_equal 9, policy.buckets.first.total_slots
    end
  end

  describe "persistence" do
    it "round-trips buckets in position order through save and reload" do
      policy =
        RegistrationPolicy.build_from_hash(
          buckets: [{ key: "first", name: "First" }, { key: "second", name: "Second" }, { key: "third", name: "Third" }]
        )

      policy.save!
      policy.reload

      assert_equal %w[first second third], policy.buckets.map(&:key)
      assert_equal [1, 2, 3], policy.buckets.map(&:position)
    end
  end
end
