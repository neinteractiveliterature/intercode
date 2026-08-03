require "test_helper"

class EventFreezeBucketAssignmentsServiceTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  let(:convention) { create(:convention, :with_notification_templates) }
  let(:event) do
    create(
      :event,
      convention:,
      registration_policy:
        RegistrationPolicy.build_from_hash(
          buckets: [
            { key: "dogs", name: "Dogs", slots_limited: true, total_slots: 1 },
            { key: "cats", name: "Cats", slots_limited: true, total_slots: 1 },
            { key: "anything", name: "Anything", slots_limited: true, total_slots: 1, anything: true }
          ]
        )
    )
  end

  let(:the_run) { create(:run, event:) }

  def create_signup(**attrs)
    user_con_profile = create(:user_con_profile, convention:)
    create(:signup, user_con_profile:, run: the_run, **attrs)
  end

  let(:dogs_bucket_id) { event.registration_policy.bucket_with_key("dogs").id }
  let(:anything_bucket_id) { event.registration_policy.bucket_with_key("anything").id }

  let(:anything_signup) do
    create_signup(state: "confirmed", bucket_id: anything_bucket_id, requested_bucket_id: dogs_bucket_id)
  end

  let(:waitlist_signup) { create_signup(state: "waitlisted", requested_bucket_id: dogs_bucket_id) }

  let(:no_pref_signup) { create_signup(state: "confirmed", bucket_id: dogs_bucket_id, requested_bucket_id: nil) }

  it "freezes bucket assignments for existing signups" do
    travel(-2.seconds) { no_pref_signup }
    travel(-1.second) { anything_signup }
    waitlist_signup

    original_policy_id = event.registration_policy_id
    original_bucket_ids = event.registration_policy.buckets.index_by(&:key).transform_values(&:id)

    result = EventFreezeBucketAssignmentsService.new(event:).call!

    event.reload
    anything_signup.reload

    assert_equal [anything_signup], result.anything_signups_with_preference
    assert_equal "dogs", anything_signup.bucket_key
    assert_equal 2, event.registration_policy.bucket_with_key("dogs").total_slots
    assert_equal 1, event.registration_policy.bucket_with_key("cats").total_slots
    assert_equal 0, event.registration_policy.bucket_with_key("anything").total_slots
    assert event.registration_policy.freeze_no_preference_buckets?

    # Regression guard: this used to reconstruct the whole bucket set via `.dup` (which silently
    # loses AR's association cache), so verify every bucket -- not just the touched ones --
    # still exists with its original row id.
    assert_equal original_policy_id, event.registration_policy_id
    assert_equal(original_bucket_ids, event.registration_policy.buckets.index_by(&:key).transform_values(&:id))
  end

  it "does not work on events with multiple runs" do
    the_run
    create(:run, event:)

    result = EventFreezeBucketAssignmentsService.new(event:).call

    assert result.failure?
    assert_match(/but #{event.title} has 2/, result.errors.to_a.first)
  end
end
