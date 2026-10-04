# frozen_string_literal: true
require "test_helper"
require_relative "../policies/convention_permissions_test_helper"

# These go through the real controller (rather than executing the schema directly) because the controller rolls
# back the whole request if the response has any errors.  An attacker who only asks for fields they're allowed to
# read, like the admin UI's own selection of just clientMutationId, gets no errors, so nothing is rolled back.
class GraphqlSignupAuthorizationTest < ActionDispatch::IntegrationTest
  include ConventionPermissionsTestHelper

  let(:convention) { create(:convention, :with_notification_templates) }
  let(:event) { create(:event, convention:) }
  let(:the_run) { create(:run, event:, starts_at: 1.day.from_now) }
  let(:bucket) { event.registration_policy.buckets.first }
  let(:attendee) { create(:user_con_profile, convention:) }

  def admin_create_signup(for_profile:)
    mutation = <<~GRAPHQL
      mutation {
        createUserSignup(input: {
          runId: "#{the_run.id}"
          userConProfileId: "#{for_profile.id}"
          requestedBucketId: "#{bucket.id}"
        }) {
          clientMutationId
        }
      }
    GRAPHQL

    post graphql_url, params: { "query" => mutation }
    assert_response :success
    response.parsed_body
  end

  setup do
    convention.signup_rounds.first.update!(maximum_event_signups: "unlimited")
    set_convention convention
  end

  it "doesn't let a regular attendee sign another attendee up, even when only asking for clientMutationId" do
    sign_in create(:user_con_profile, convention:).user

    json = admin_create_signup(for_profile: attendee)

    assert_match(/Unauthorized mutation/, Array(json["errors"]).pluck("message").join(", "))
    assert_equal 0, Signup.where(user_con_profile: attendee).count
  end

  it "doesn't let a regular attendee sign themselves up through the admin mutation" do
    own_profile = create(:user_con_profile, convention:)
    sign_in own_profile.user

    json = admin_create_signup(for_profile: own_profile)

    assert_match(/Unauthorized mutation/, Array(json["errors"]).pluck("message").join(", "))
    assert_equal 0, Signup.where(user_con_profile: own_profile).count
  end

  it "lets staff with update_signups sign an attendee up, with no errors in the response" do
    sign_in create_user_with_update_signups_in_convention(convention)

    json = admin_create_signup(for_profile: attendee)

    assert_nil json["errors"]
    assert_equal ["confirmed"], Signup.where(user_con_profile: attendee).pluck(:state)
  end
end
