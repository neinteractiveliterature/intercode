# frozen_string_literal: true
# rubocop:disable GraphQL/ObjectDescription
require "test_helper"

class Mutations::UpdateSignupBucketTest < ActiveSupport::TestCase
  let(:convention) { create(:convention) }
  let(:registration_policy) do
    RegistrationPolicy.build_from_hash(
      buckets: [
        { key: "dogs", name: "Dogs", slots_limited: true, total_slots: 10 },
        { key: "cats", name: "Cats", slots_limited: true, total_slots: 10 }
      ]
    )
  end
  let(:event) { create(:event, convention:, registration_policy:) }
  let(:the_run) { create(:run, event:) }
  let(:admin_user_con_profile) { create(:user_con_profile, convention:, user: create(:site_admin)) }
  let(:signup) { create(:signup, run: the_run, bucket_id: bucket_with_key(registration_policy, "dogs").id) }

  MUTATION = <<~GRAPHQL
    mutation TestUpdateSignupBucket($id: ID!, $bucketId: ID, $bucketKey: String) {
      updateSignupBucket(input: { id: $id, bucketId: $bucketId, bucket_key: $bucketKey }) {
        signup { id }
      }
    }
  GRAPHQL

  it "moves the signup into the given bucket" do
    cats_bucket = bucket_with_key(registration_policy, "cats")

    execute_graphql_query(
      MUTATION,
      user_con_profile: admin_user_con_profile,
      variables: {
        "id" => signup.id.to_s,
        "bucketId" => cats_bucket.id.to_s,
        "bucketKey" => nil
      }
    )

    assert_equal cats_bucket.id, signup.reload.bucket_id
  end

  it "raises a GraphQL error instead of a 500 when bucketId belongs to a different event's policy" do
    other_registration_policy =
      RegistrationPolicy.build_from_hash(
        buckets: [{ key: "foxes", name: "Foxes", slots_limited: true, total_slots: 10 }]
      )
    other_event = create(:event, convention:, registration_policy: other_registration_policy)
    foreign_bucket_id = bucket_with_key(other_registration_policy, "foxes").id
    original_bucket_id = signup.bucket_id

    error =
      assert_raises(GraphqlTestExecutionError) do
        execute_graphql_query(
          MUTATION,
          user_con_profile: admin_user_con_profile,
          variables: {
            "id" => signup.id.to_s,
            "bucketId" => foreign_bucket_id.to_s,
            "bucketKey" => nil
          }
        )
      end

    assert_match(/bucketId or bucketKey is required/, error.message)
    assert_equal original_bucket_id, signup.reload.bucket_id
    assert_not_equal other_event.id, event.id
  end

  it "raises a GraphQL error instead of a 500 when neither bucketId nor bucketKey is given" do
    original_bucket_id = signup.bucket_id

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
    assert_equal original_bucket_id, signup.reload.bucket_id
  end
end
# rubocop:enable GraphQL/ObjectDescription
