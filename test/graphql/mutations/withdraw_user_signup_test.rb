# frozen_string_literal: true
# rubocop:disable GraphQL/ObjectDescription
require "test_helper"
require_relative "../../policies/convention_permissions_test_helper"

class Mutations::WithdrawUserSignupTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:signup_mode) { "moderated" }
  let(:convention) { create(:convention, :with_notification_templates, signup_mode:) }
  let(:registration_policy) do
    RegistrationPolicy.build_from_hash(buckets: [{ key: "dogs", name: "Dogs", slots_limited: true, total_slots: 1 }])
  end
  let(:event) { create(:event, convention:, registration_policy:) }
  let(:the_run) { create(:run, event:, starts_at: 1.day.from_now) }
  let(:dogs_bucket) { bucket_with_key(registration_policy, "dogs") }
  let(:signup) { create(:signup, run: the_run, bucket_id: dogs_bucket.id, requested_bucket_id: dogs_bucket.id) }
  let(:attendee) { signup.user_con_profile }
  let(:admin) do
    create_user_with_permissions_in_convention(
      %w[update_signups read_signup_details],
      convention
    ).user_con_profiles.find_by!(convention:)
  end

  MUTATION = <<~GRAPHQL
    mutation TestWithdrawUserSignup($runId: ID!, $userConProfileId: ID!) {
      withdrawUserSignup(input: { runId: $runId, userConProfileId: $userConProfileId }) {
        signup { id state }
      }
    }
  GRAPHQL

  def withdraw(as:, attendee_profile: attendee)
    execute_graphql_query(
      MUTATION,
      user_con_profile: as,
      variables: {
        "runId" => the_run.id.to_s,
        "userConProfileId" => attendee_profile.id.to_s
      }
    )
  end

  it "lets attendees withdraw from their own signups" do
    result = withdraw(as: attendee)

    assert_equal "withdrawn", result["data"]["withdrawUserSignup"]["signup"]["state"]
    assert_equal "withdrawn", signup.reload.state
  end

  it "lets users with update_signups withdraw other people's signups in moderated conventions" do
    result = withdraw(as: admin)

    assert_equal "withdrawn", result["data"]["withdrawUserSignup"]["signup"]["state"]
    assert_equal "withdrawn", signup.reload.state
  end

  it "moves someone up from the waitlist when a confirmed signup is withdrawn" do
    signup
    waitlisted = create(:signup, run: the_run, state: "waitlisted", counted: false, bucket_id: nil)

    withdraw(as: attendee)

    assert_equal "confirmed", waitlisted.reload.state
  end

  it "returns a GraphQL error if the user isn't signed up" do
    other_profile = create(:user_con_profile, convention:)

    error = assert_raises(GraphqlTestExecutionError) { withdraw(as: admin, attendee_profile: other_profile) }

    assert_match(/is not signed up for #{Regexp.escape(event.title)}/, error.message)
  end

  it "doesn't count an already-withdrawn signup" do
    signup.update!(state: "withdrawn", counted: false, bucket_id: nil)

    error = assert_raises(GraphqlTestExecutionError) { withdraw(as: attendee) }

    assert_match(/is not signed up/, error.message)
  end

  it "doesn't let regular attendees withdraw other people" do
    stranger = create(:user_con_profile, convention:)

    error = assert_raises(GraphqlTestExecutionError) { withdraw(as: stranger) }

    assert_match(/Unauthorized mutation/, error.message)
    assert_equal "confirmed", signup.reload.state
  end

  it "doesn't let admins from another convention withdraw people" do
    other_admin = create_user_with_update_signups_in_convention(create(:convention)).user_con_profiles.first

    assert_raises(GraphqlTestExecutionError) { withdraw(as: other_admin) }
    assert_equal "confirmed", signup.reload.state
  end

  describe "in a self-service convention" do
    let(:signup_mode) { "self_service" }

    it "still lets attendees withdraw from their own signups" do
      withdraw(as: attendee)

      assert_equal "withdrawn", signup.reload.state
    end

    # Unlike signing people up, withdrawing other people is only for moderated conventions (or site admins)
    it "doesn't let users with update_signups withdraw other people's signups" do
      assert_raises(GraphqlTestExecutionError) { withdraw(as: admin) }
      assert_equal "confirmed", signup.reload.state
    end
  end
end
# rubocop:enable GraphQL/ObjectDescription
