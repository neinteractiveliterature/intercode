# frozen_string_literal: true
# rubocop:disable GraphQL/ObjectDescription
require "test_helper"

class Mutations::CreateSignupRankedChoiceTest < ActiveSupport::TestCase
  let(:automation_mode) { "ranked_choice" }
  let(:convention) do
    create(:convention, :with_notification_templates, signup_mode: "moderated", signup_automation_mode: automation_mode)
  end
  let(:registration_policy) do
    RegistrationPolicy.build_from_hash(
      buckets: [
        { key: "dogs", name: "Dogs", slots_limited: true, total_slots: 5 },
        { key: "cats", name: "Cats", slots_limited: true, total_slots: 5 }
      ]
    )
  end
  let(:event) { create(:event, convention:, registration_policy:) }
  let(:the_run) { create(:run, event:, starts_at: 1.day.from_now) }
  let(:attendee) { create(:user_con_profile, convention:) }
  let(:dogs_bucket) { bucket_with_key(registration_policy, "dogs") }

  MUTATION = <<~GRAPHQL
    mutation TestCreateSignupRankedChoice($targetRunId: ID!, $requestedBucketId: ID) {
      createSignupRankedChoice(input: { targetRunId: $targetRunId, requestedBucketId: $requestedBucketId }) {
        signup_ranked_choice { id state priority requested_bucket { id name description } }
      }
    }
  GRAPHQL

  before { the_run }

  def queue_choice(requested_bucket_id: dogs_bucket.id.to_s, run: the_run)
    execute_graphql_query(
      MUTATION,
      user_con_profile: attendee,
      variables: {
        "targetRunId" => run.id.to_s,
        "requestedBucketId" => requested_bucket_id
      }
    )
  end

  it "adds a pending choice to the attendee's queue" do
    result = queue_choice

    choice = SignupRankedChoice.find(result["data"]["createSignupRankedChoice"]["signup_ranked_choice"]["id"])
    assert_equal "pending", choice.state
    assert_equal attendee, choice.user_con_profile
    assert_equal the_run, choice.target_run
    assert_equal dogs_bucket.id, choice.requested_bucket_id
    assert_equal attendee.user, choice.updated_by
  end

  it "puts each new choice at the end of the queue" do
    other_run = create(:run, event: create(:event, convention:), starts_at: 1.day.from_now)

    queue_choice
    queue_choice(requested_bucket_id: nil, run: other_run)

    assert_equal [1, 2], attendee.signup_ranked_choices.order(:priority).pluck(:priority)
    assert_equal [the_run, other_run], attendee.signup_ranked_choices.order(:priority).map(&:target_run)
  end

  it "can queue a choice with no bucket preference" do
    result = queue_choice(requested_bucket_id: nil)

    assert_nil result["data"]["createSignupRankedChoice"]["signup_ranked_choice"]["requested_bucket"]
  end

  describe "in a convention without ranked choice signups" do
    let(:automation_mode) { "none" }

    it "isn't allowed" do
      error = assert_raises(GraphqlTestExecutionError) { queue_choice }

      assert_match(/Unauthorized mutation/, error.message)
      assert_equal 0, attendee.signup_ranked_choices.count
    end
  end

  describe "with a bucket that isn't in the event's registration policy" do
    let(:foreign_policy) do
      RegistrationPolicy.build_from_hash(
        buckets: [
          {
            key: "secret",
            name: "Another convention's bucket",
            description: "Private details",
            slots_limited: true,
            total_slots: 5
          }
        ]
      )
    end
    let(:foreign_bucket) do
      create(:event, convention: create(:convention), registration_policy: foreign_policy)
        .registration_policy
        .buckets
        .first
    end

    it "refuses a bucket from another convention, without revealing anything about it" do
      error = assert_raises(GraphqlTestExecutionError) { queue_choice(requested_bucket_id: foreign_bucket.id.to_s) }

      assert_match(/not a bucket in the registration policy/, error.message)
      assert_no_match(/Another convention's bucket|Private details/, error.message)
      assert_equal 0, attendee.signup_ranked_choices.count
    end

    it "refuses a bucket from a different event in the same convention" do
      other_bucket = create(:event, convention:).registration_policy.buckets.first

      error = assert_raises(GraphqlTestExecutionError) { queue_choice(requested_bucket_id: other_bucket.id.to_s) }

      assert_match(/not a bucket in the registration policy/, error.message)
      assert_equal 0, attendee.signup_ranked_choices.count
    end
  end
end
# rubocop:enable GraphQL/ObjectDescription
