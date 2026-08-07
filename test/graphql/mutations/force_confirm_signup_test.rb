# frozen_string_literal: true
# rubocop:disable GraphQL/ObjectDescription
require "test_helper"

class Mutations::ForceConfirmSignupTest < ActiveSupport::TestCase
  let(:convention) { create(:convention) }
  let(:registration_policy) do
    RegistrationPolicy.build_from_hash(buckets: [{ key: "dogs", name: "Dogs", slots_limited: true, total_slots: 10 }])
  end
  let(:event) { create(:event, convention:, registration_policy:) }
  let(:the_run) { create(:run, event:) }
  let(:admin_user_con_profile) { create(:user_con_profile, convention:, user: create(:site_admin)) }
  let(:signup) { create(:signup, run: the_run, state: "waitlisted", bucket_id: nil, counted: false) }

  MUTATION = <<~GRAPHQL
    mutation TestForceConfirmSignup($id: ID!, $bucketId: ID, $bucketKey: String) {
      forceConfirmSignup(input: { id: $id, bucketId: $bucketId, bucket_key: $bucketKey }) {
        signup { id state }
      }
    }
  GRAPHQL

  it "confirms the signup into the given bucket" do
    dogs_bucket = bucket_with_key(registration_policy, "dogs")

    execute_graphql_query(
      MUTATION,
      user_con_profile: admin_user_con_profile,
      variables: {
        "id" => signup.id.to_s,
        "bucketId" => dogs_bucket.id.to_s,
        "bucketKey" => nil
      }
    )

    signup.reload
    assert_equal "confirmed", signup.state
    assert_equal dogs_bucket.id, signup.bucket_id
  end

  it "raises a GraphQL error instead of a 500 when neither bucketId nor bucketKey is given" do
    error =
      assert_raises(GraphqlTestExecutionError) do
        execute_graphql_query(
          MUTATION,
          user_con_profile: admin_user_con_profile,
          variables: {
            "id" => signup.id.to_s,
            "bucketId" => nil,
            "bucketKey" => nil
          }
        )
      end

    assert_match(/bucketId or bucketKey is required/, error.message)
    assert_equal "waitlisted", signup.reload.state
  end

  it "raises a GraphQL error instead of a 500 when bucketKey is an empty string (as the frontend sends)" do
    error =
      assert_raises(GraphqlTestExecutionError) do
        execute_graphql_query(
          MUTATION,
          user_con_profile: admin_user_con_profile,
          variables: {
            "id" => signup.id.to_s,
            "bucketId" => nil,
            "bucketKey" => ""
          }
        )
      end

    assert_match(/bucketId or bucketKey is required/, error.message)
    assert_equal "waitlisted", signup.reload.state
  end
end
# rubocop:enable GraphQL/ObjectDescription
