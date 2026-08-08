# frozen_string_literal: true
require "test_helper"

class ReportsControllerTest < ActionDispatch::IntegrationTest
  let(:convention) { create(:convention) }
  let(:con_admin_staff_position) { create(:admin_staff_position, convention: convention) }
  let(:con_admin_profile) do
    profile = create(:user_con_profile, convention: convention)
    con_admin_staff_position.user_con_profiles << profile
    profile
  end
  let(:con_admin) { con_admin_profile.user }

  let(:event) do
    create(
      :event,
      convention: convention,
      registration_policy:
        RegistrationPolicy.build_from_hash(
          buckets: [
            { key: "dogs", name: "Dogs", slots_limited: true, total_slots: 1 },
            { key: "cats", name: "Cats", slots_limited: true, total_slots: 1 }
          ]
        )
    )
  end
  let(:event_run) { create(:run, event: event) }

  setup do
    host! convention.domain
    sign_in con_admin
  end

  describe "GET per_event" do
    it "renders without error for an event with a waitlisted signup requesting a bucket" do
      dogs_bucket = bucket_with_key(event.registration_policy, "dogs")
      create(:signup, run: event_run, bucket_id: dogs_bucket.id, state: "confirmed")
      create(:signup, run: event_run, state: "waitlisted", requested_bucket_id: dogs_bucket.id, bucket_id: nil)

      get reports_per_event_path

      assert_response :ok
      assert_includes response.body, "Dogs"
    end

    it "renders without error for an event with no waitlisted signups" do
      create(:signup, run: event_run, bucket_id: bucket_with_key(event.registration_policy, "dogs").id)

      get reports_per_event_path

      assert_response :ok
    end
  end

  describe "GET single_user_printable" do
    it "renders without error for a user with a waitlisted signup requesting a bucket" do
      dogs_bucket = bucket_with_key(event.registration_policy, "dogs")
      team_member_profile = create(:user_con_profile, convention: convention)
      create(:team_member, event: event, user_con_profile: team_member_profile)
      create(
        :signup,
        run: event_run,
        user_con_profile: team_member_profile,
        state: "waitlisted",
        requested_bucket_id: dogs_bucket.id,
        bucket_id: nil
      )

      get reports_path(user_con_profile_id: team_member_profile.id)

      assert_response :ok
      assert_includes response.body, "Dogs"
    end
  end
end
