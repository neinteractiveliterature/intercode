# frozen_string_literal: true
# rubocop:disable GraphQL/ObjectDescription
require "test_helper"
require_relative "../../policies/convention_permissions_test_helper"

class Mutations::CreateUserSignupTest < ActiveSupport::TestCase
  include ConventionPermissionsTestHelper

  let(:convention) { create(:convention, :with_notification_templates) }
  let(:registration_policy) do
    RegistrationPolicy.build_from_hash(buckets: [{ key: "dogs", name: "Dogs", slots_limited: true, total_slots: 1 }])
  end
  let(:event) { create(:event, convention:, registration_policy:) }
  let(:the_run) { create(:run, event:, starts_at: 1.day.from_now) }
  let(:attendee) { create(:user_con_profile, convention:) }
  let(:dogs_bucket) { bucket_with_key(registration_policy, "dogs") }

  MUTATION = <<~GRAPHQL
    mutation TestCreateUserSignup($runId: ID!, $userConProfileId: ID!, $requestedBucketId: ID, $noRequestedBucket: Boolean) {
      createUserSignup(
        input: {
          runId: $runId
          userConProfileId: $userConProfileId
          requestedBucketId: $requestedBucketId
          no_requested_bucket: $noRequestedBucket
        }
      ) {
        signup { id state }
      }
    }
  GRAPHQL

  before { convention.signup_rounds.first.update!(maximum_event_signups: "unlimited") }

  # update_signups lets them sign people up; read_signup_details lets them see the signup they just created
  let(:signup_admin) do
    profile_for(create_user_with_permissions_in_convention(%w[update_signups read_signup_details], convention))
  end

  def profile_for(user)
    user.user_con_profiles.find_by!(convention:)
  end

  def sign_up(as:, **variables)
    execute_graphql_query(
      MUTATION,
      user_con_profile: as,
      variables: {
        "runId" => the_run.id.to_s,
        "userConProfileId" => attendee.id.to_s,
        "requestedBucketId" => dogs_bucket.id.to_s
      }.merge(variables.stringify_keys)
    )
  end

  %w[self_service moderated].each do |signup_mode|
    describe "in a #{signup_mode} convention" do
      before { convention.update!(signup_mode:) }

      it "lets users with update_signups sign other people up" do
        admin = signup_admin

        result = sign_up(as: admin)

        signup = Signup.find(result["data"]["createUserSignup"]["signup"]["id"])
        assert_equal "confirmed", signup.state
        assert_equal attendee, signup.user_con_profile
        assert_equal dogs_bucket.id, signup.bucket_id
        assert_equal "admin_create_signup", signup.signup_changes.order(:id).last.action
      end

      it "doesn't let regular attendees sign themselves up through the admin mutation" do
        # Admin signups skip the self-service checks, so e.g. a moderated convention's signup requests could be bypassed
        error = assert_raises(GraphqlTestExecutionError) { sign_up(as: attendee) }

        assert_match(/Unauthorized mutation/, error.message)
        assert_equal 0, Signup.where(run: the_run).count
      end

      it "lets users with update_signups sign themselves up through the admin mutation" do
        result = sign_up(:as => signup_admin, "userConProfileId" => signup_admin.id.to_s)

        assert_equal "confirmed", result["data"]["createUserSignup"]["signup"]["state"]
      end

      it "doesn't let regular attendees sign other people up" do
        stranger = create(:user_con_profile, convention:)

        error = assert_raises(GraphqlTestExecutionError) { sign_up(as: stranger) }

        assert_match(/Unauthorized mutation/, error.message)
        assert_equal 0, Signup.where(run: the_run).count
      end
    end
  end

  it "lets site admins sign other people up" do
    site_admin = create(:user_con_profile, convention:, user: create(:site_admin))

    result = sign_up(as: site_admin)

    assert_equal "confirmed", result["data"]["createUserSignup"]["signup"]["state"]
  end

  it "lets users with update_signups sign people up with no bucket preference" do
    admin = signup_admin

    result = sign_up(:as => admin, "requestedBucketId" => nil, "noRequestedBucket" => true)

    signup = Signup.find(result["data"]["createUserSignup"]["signup"]["id"])
    assert_nil signup.requested_bucket_id
  end

  it "returns a GraphQL error if neither a bucket nor 'no bucket' is given" do
    admin = signup_admin

    error = assert_raises(GraphqlTestExecutionError) { sign_up(:as => admin, "requestedBucketId" => nil) }

    assert_match(/signups must either request a bucket/, error.message)
    assert_equal 0, Signup.where(run: the_run).count
  end

  it "doesn't let users with only other convention permissions sign other people up" do
    other_admin = profile_for(create_user_with_update_convention_in_convention(convention))

    assert_raises(GraphqlTestExecutionError) { sign_up(as: other_admin) }
    assert_equal 0, Signup.where(run: the_run).count
  end

  it "doesn't let admins from another convention sign people up" do
    other_admin = create_user_with_update_signups_in_convention(create(:convention)).user_con_profiles.first

    assert_raises(GraphqlTestExecutionError) { sign_up(as: other_admin) }
    assert_equal 0, Signup.where(run: the_run).count
  end
end
# rubocop:enable GraphQL/ObjectDescription
