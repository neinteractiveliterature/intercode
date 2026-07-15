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
require "test_helper"

class RegistrationPolicyBucketTest < ActiveSupport::TestCase
  describe ".normalize_key" do
    it "downcases and replaces non-alphanumeric characters with underscores" do
      assert_equal "don_t_care", RegistrationPolicyBucket.normalize_key("Don't Care")
    end
  end

  describe "#key=" do
    it "normalizes the key on assignment" do
      bucket = RegistrationPolicyBucket.new(key: "Some Key!")
      assert_equal "some_key_", bucket.key
    end
  end

  describe "anything/not_counted aliases" do
    let(:bucket) { build(:registration_policy_bucket) }

    it "anything?/anything= round-trip through the real flex column" do
      bucket.anything = true
      assert bucket.anything?
      assert bucket.flex?

      bucket.anything = false
      assert_not bucket.anything?
      assert_not bucket.flex?
    end

    it "not_counted?/not_counted= round-trip through the real counted column, inverted" do
      bucket.not_counted = true
      assert bucket.not_counted?
      assert_not bucket.counted?

      bucket.not_counted = false
      assert_not bucket.not_counted?
      assert bucket.counted?
    end
  end

  describe "#slots_unlimited?/#slots_unlimited=" do
    it "is the inverse of slots_limited" do
      bucket = build(:registration_policy_bucket, slots_limited: true)
      assert_not bucket.slots_unlimited?

      bucket.slots_unlimited = true
      assert_not bucket.slots_limited?
    end
  end

  describe "#available_slots/#full?/#has_available_slots?" do
    it "returns nil for available_slots when slots are unlimited" do
      bucket = build(:registration_policy_bucket, slots_limited: false)
      assert_nil bucket.available_slots([])
      assert bucket.has_available_slots?([])
      assert_not bucket.full?([])
    end

    it "counts only signups that definitely occupy a slot in this bucket" do
      bucket = create(:registration_policy_bucket, slots_limited: true, total_slots: 1)
      signup =
        create(
          :signup,
          run: create(:run, event: create(:event, registration_policy: bucket.registration_policy)),
          bucket_key: bucket.key,
          counted: true
        )

      assert_equal 0, bucket.available_slots([signup])
      assert bucket.full?([signup])
      assert_not bucket.has_available_slots?([signup])
    end
  end

  describe "#signup_definitely_occupies_slot_in_bucket?" do
    let(:bucket) { build(:registration_policy_bucket, key: "pcs") }

    it "returns true for a confirmed Signup with a matching bucket_key" do
      signup = build(:signup, state: "confirmed", bucket_key: "pcs", counted: true)
      assert bucket.signup_definitely_occupies_slot_in_bucket?(signup)
    end

    it "returns false for a Signup that isn't occupying a slot" do
      signup = build(:signup, state: "withdrawn", bucket_key: "pcs", counted: true)
      assert_not bucket.signup_definitely_occupies_slot_in_bucket?(signup)
    end

    it "excludes an uncounted signup from a counted bucket, but not_counted buckets count everyone" do
      counted_bucket = build(:registration_policy_bucket, key: "pcs", not_counted: false)
      not_counted_bucket = build(:registration_policy_bucket, key: "pcs", not_counted: true)
      counted_signup = build(:signup, state: "confirmed", bucket_key: "pcs", counted: true)
      uncounted_signup = build(:signup, state: "confirmed", bucket_key: "pcs", counted: false)

      assert counted_bucket.signup_definitely_occupies_slot_in_bucket?(counted_signup)
      assert_not counted_bucket.signup_definitely_occupies_slot_in_bucket?(uncounted_signup)
      assert not_counted_bucket.signup_definitely_occupies_slot_in_bucket?(counted_signup)
      assert not_counted_bucket.signup_definitely_occupies_slot_in_bucket?(uncounted_signup)
    end

    it "returns true for a FakeSignup that occupies a slot with a matching bucket_key" do
      fake_signup = SignupBucketFinder::FakeSignup.new(state: "confirmed", bucket_key: "pcs", counted: true)
      assert bucket.signup_definitely_occupies_slot_in_bucket?(fake_signup)
    end

    it "checks state and requested_bucket_key for a SignupRequest" do
      pending_request = build(:signup_request, state: "pending", requested_bucket_key: "pcs")
      other_state_request = build(:signup_request, state: "withdrawn", requested_bucket_key: "pcs")

      assert bucket.signup_definitely_occupies_slot_in_bucket?(pending_request)
      assert_not bucket.signup_definitely_occupies_slot_in_bucket?(other_state_request)
    end

    it "raises ArgumentError for an unrecognized object" do
      assert_raises(ArgumentError) { bucket.signup_definitely_occupies_slot_in_bucket?(Object.new) }
    end
  end

  describe "database constraints" do
    it "enforces uniqueness of key within a registration policy" do
      policy = create(:registration_policy)
      create(:registration_policy_bucket, registration_policy: policy, key: "pcs", position: 1)

      assert_raises(ActiveRecord::RecordNotUnique) do
        RegistrationPolicyBucket.new(registration_policy: policy, key: "pcs", name: "Duplicate", position: 2).save!(
          validate: false
        )
      end
    end
  end
end
