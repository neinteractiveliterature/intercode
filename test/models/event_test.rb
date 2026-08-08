# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: events
#
#  id                           :bigint           not null, primary key
#  additional_info              :jsonb
#  admin_notes                  :text
#  age_restrictions_description :text
#  author                       :string
#  can_play_concurrently        :boolean          default(FALSE), not null
#  con_mail_destination         :string
#  content_warnings             :text
#  description                  :text
#  email                        :string
#  length_seconds               :integer          not null
#  minimum_age                  :integer
#  organization                 :string
#  participant_communications   :text
#  private_signup_list          :boolean          default(FALSE), not null
#  short_blurb                  :text
#  status                       :string           default("active"), not null
#  team_mailing_list_name       :text
#  title                        :string           not null
#  title_vector                 :tsvector
#  url                          :text
#  created_at                   :datetime
#  updated_at                   :datetime
#  convention_id                :bigint           not null
#  event_category_id            :bigint           not null
#  owner_id                     :bigint
#  registration_policy_id       :bigint           not null
#  updated_by_id                :bigint
#
# Indexes
#
#  index_events_on_convention_id           (convention_id)
#  index_events_on_event_category_id       (event_category_id)
#  index_events_on_owner_id                (owner_id)
#  index_events_on_registration_policy_id  (registration_policy_id) UNIQUE
#  index_events_on_title_vector            (title_vector) USING gin
#  index_events_on_updated_by_id           (updated_by_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#  fk_rails_...  (event_category_id => event_categories.id)
#  fk_rails_...  (owner_id => users.id)
#  fk_rails_...  (registration_policy_id => registration_policies.id)
#  fk_rails_...  (updated_by_id => users.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
require "test_helper"

class EventTest < ActiveSupport::TestCase
  let(:convention) { create(:convention) }
  let(:event) do
    create(
      :event,
      convention: convention,
      registration_policy:
        RegistrationPolicy.build_from_hash(
          buckets: [
            { key: "dogs", name: "Dogs", slots_limited: true, total_slots: 2 },
            { key: "cats", name: "Cats", slots_limited: true, total_slots: 2 },
            { key: "anything", name: "Anything", slots_limited: true, total_slots: 2, anything: true }
          ]
        )
    )
  end
  let(:the_run) { create(:run, event: event) }

  describe "#bucket_keys_with_pending_signups_or_requests" do
    it "returns an empty array for an event with no runs" do
      assert_equal [], event.bucket_keys_with_pending_signups_or_requests
    end

    it "returns an empty array for an event with runs but no signups" do
      the_run
      assert_equal [], event.bucket_keys_with_pending_signups_or_requests
    end

    it "includes requested_bucket_key from active signups" do
      dogs_id = bucket_with_key(event.registration_policy, "dogs").id
      create(:signup, run: the_run, requested_bucket_id: dogs_id, bucket_id: dogs_id)
      assert_includes event.bucket_keys_with_pending_signups_or_requests, "dogs"
    end

    it "excludes withdrawn signups" do
      dogs_id = bucket_with_key(event.registration_policy, "dogs").id
      create(:signup, run: the_run, requested_bucket_id: dogs_id, state: "withdrawn")
      assert_equal [], event.bucket_keys_with_pending_signups_or_requests
    end

    it "includes requested_bucket_key from pending signup requests" do
      cats_id = bucket_with_key(event.registration_policy, "cats").id
      create(:signup_request, target_run: the_run, requested_bucket_id: cats_id)
      assert_includes event.bucket_keys_with_pending_signups_or_requests, "cats"
    end

    it "includes requested_bucket_key from signup ranked choices" do
      anything_id = bucket_with_key(event.registration_policy, "anything").id
      create(:signup_ranked_choice, target_run: the_run, requested_bucket_id: anything_id)
      assert_includes event.bucket_keys_with_pending_signups_or_requests, "anything"
    end

    it "deduplicates keys across all three sources" do
      dogs_id = bucket_with_key(event.registration_policy, "dogs").id
      create(:signup, run: the_run, requested_bucket_id: dogs_id, bucket_id: dogs_id)
      create(:signup_request, target_run: the_run, requested_bucket_id: dogs_id)
      assert_equal ["dogs"], event.bucket_keys_with_pending_signups_or_requests
    end
  end

  describe "#bucket_ids_with_pending_signups_or_requests" do
    it "returns an empty array for an event with no runs" do
      assert_equal [], event.bucket_ids_with_pending_signups_or_requests
    end

    it "returns an empty array for an event with runs but no signups" do
      the_run
      assert_equal [], event.bucket_ids_with_pending_signups_or_requests
    end

    it "includes requested_bucket_id from active signups" do
      dogs_id = bucket_with_key(event.registration_policy, "dogs").id
      create(:signup, run: the_run, requested_bucket_id: dogs_id, bucket_id: dogs_id)
      assert_includes event.bucket_ids_with_pending_signups_or_requests, dogs_id
    end

    it "excludes withdrawn signups" do
      dogs_id = bucket_with_key(event.registration_policy, "dogs").id
      create(:signup, run: the_run, requested_bucket_id: dogs_id, state: "withdrawn")
      assert_equal [], event.bucket_ids_with_pending_signups_or_requests
    end

    it "includes requested_bucket_id from pending signup requests" do
      cats_id = bucket_with_key(event.registration_policy, "cats").id
      create(:signup_request, target_run: the_run, requested_bucket_id: cats_id)
      assert_includes event.bucket_ids_with_pending_signups_or_requests, cats_id
    end

    it "includes requested_bucket_id from signup ranked choices" do
      anything_id = bucket_with_key(event.registration_policy, "anything").id
      create(:signup_ranked_choice, target_run: the_run, requested_bucket_id: anything_id)
      assert_includes event.bucket_ids_with_pending_signups_or_requests, anything_id
    end

    it "deduplicates ids across all three sources" do
      dogs_id = bucket_with_key(event.registration_policy, "dogs").id
      create(:signup, run: the_run, requested_bucket_id: dogs_id, bucket_id: dogs_id)
      create(:signup_request, target_run: the_run, requested_bucket_id: dogs_id)
      assert_equal [dogs_id], event.bucket_ids_with_pending_signups_or_requests
    end

    it "still returns bucket keys from the deprecated method with the same underlying data" do
      dogs_id = bucket_with_key(event.registration_policy, "dogs").id
      create(:signup, run: the_run, requested_bucket_id: dogs_id, bucket_id: dogs_id)
      assert_equal ["dogs"], event.bucket_keys_with_pending_signups_or_requests
      assert_equal [dogs_id], event.bucket_ids_with_pending_signups_or_requests
    end
  end

  describe "#registration_policy_change_for (from the HasRegistrationPolicy concern)" do
    it "returns nil when given a nil hash" do
      assert_nil event.registration_policy_change_for(nil)
    end

    it "returns nil when the hash describes an equivalent policy" do
      assert_nil event.registration_policy_change_for(event.registration_policy.as_json)
    end

    it "returns a Change with the detached new policy and the old policy's JSON when the hash differs" do
      new_hash = { buckets: [{ key: "unlimited", name: "Signups", slots_limited: false, anything: true }] }
      change = event.registration_policy_change_for(new_hash)

      assert change.new_policy.equivalent_to?(RegistrationPolicy.build_from_hash(new_hash))
      assert_not change.new_policy.persisted?
      assert_equal event.registration_policy.as_json, change.old_json
    end
  end

  describe "registration_policy_id uniqueness" do
    it "rejects a second event pointing at the same registration_policy row" do
      other_event = build(:event, convention:, registration_policy: event.registration_policy)
      assert_raises(ActiveRecord::RecordNotUnique) { other_event.save!(validate: false) }
    end
  end
end
