# frozen_string_literal: true
# rubocop:disable GraphQL/ObjectDescription
require "test_helper"

class Mutations::CreateSignupRequestTest < ActiveSupport::TestCase
  let(:signup_mode) { "moderated" }
  let(:convention) { create(:convention, :with_notification_templates, signup_mode:, signup_requests_open: true) }
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
    mutation TestCreateSignupRequest($targetRunId: ID!, $requestedBucketId: ID, $replaceSignupId: ID) {
      createSignupRequest(input: { targetRunId: $targetRunId, requestedBucketId: $requestedBucketId, replaceSignupId: $replaceSignupId }) {
        signup_request { id state requested_bucket { id name description } }
      }
    }
  GRAPHQL

  before do
    convention.signup_rounds.first.update!(maximum_event_signups: "unlimited")
    the_run
  end

  def request_signup(requested_bucket_id: dogs_bucket.id.to_s, replace_signup_id: nil, run: the_run)
    execute_graphql_query(
      MUTATION,
      user_con_profile: attendee,
      variables: {
        "targetRunId" => run.id.to_s,
        "requestedBucketId" => requested_bucket_id,
        "replaceSignupId" => replace_signup_id
      }
    )
  end

  it "creates a pending signup request in the requested bucket" do
    result = request_signup

    signup_request = SignupRequest.find(result["data"]["createSignupRequest"]["signup_request"]["id"])
    assert_equal "pending", signup_request.state
    assert_equal attendee, signup_request.user_con_profile
    assert_equal the_run, signup_request.target_run
    assert_equal dogs_bucket.id, signup_request.requested_bucket_id
    assert_equal attendee.user, signup_request.updated_by
  end

  it "can request a signup with no bucket preference" do
    result = request_signup(requested_bucket_id: nil)

    assert_nil result["data"]["createSignupRequest"]["signup_request"]["requested_bucket"]
    assert_equal 1, attendee.signup_requests.count
  end

  it "can ask to replace one of the attendee's own signups" do
    other_run = create(:run, event: create(:event, convention:), starts_at: 1.day.from_now)
    existing = create(:signup, user_con_profile: attendee, run: other_run)

    result = request_signup(replace_signup_id: existing.id.to_s)

    assert_equal existing,
                 SignupRequest.find(result["data"]["createSignupRequest"]["signup_request"]["id"]).replace_signup
  end

  it "doesn't let attendees ask to replace someone else's signup" do
    other_signup = create(:signup, run: create(:run, event: create(:event, convention:), starts_at: 1.day.from_now))

    assert_raises(GraphqlTestExecutionError) { request_signup(replace_signup_id: other_signup.id.to_s) }
    assert_equal 0, attendee.signup_requests.count
  end

  it "fails if signup requests aren't open yet" do
    convention.update!(signup_requests_open: false)

    error = assert_raises(GraphqlTestExecutionError) { request_signup }

    assert_match(/not (currently )?open|closed|aren't open/i, error.message)
    assert_equal 0, attendee.signup_requests.count
  end

  it "fails if the attendee is already signed up for something at the same time" do
    conflicting_event = create(:event, convention:)
    create(
      :signup,
      user_con_profile: attendee,
      run: create(:run, event: conflicting_event, starts_at: the_run.starts_at)
    )

    assert_raises(GraphqlTestExecutionError) { request_signup }
    assert_equal 0, attendee.signup_requests.count
  end

  describe "in a self-service convention" do
    let(:signup_mode) { "self_service" }

    it "isn't allowed: attendees sign up directly instead" do
      error = assert_raises(GraphqlTestExecutionError) { request_signup }

      assert_match(/Unauthorized mutation/, error.message)
      assert_equal 0, attendee.signup_requests.count
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
      error = assert_raises(GraphqlTestExecutionError) { request_signup(requested_bucket_id: foreign_bucket.id.to_s) }

      assert_match(/not a bucket in the registration policy/, error.message)
      assert_no_match(/Another convention's bucket|Private details/, error.message)
      assert_equal 0, attendee.signup_requests.count
    end

    it "refuses a bucket from a different event in the same convention" do
      other_event = create(:event, convention:)
      other_bucket = other_event.registration_policy.buckets.first

      error = assert_raises(GraphqlTestExecutionError) { request_signup(requested_bucket_id: other_bucket.id.to_s) }

      assert_match(/not a bucket in the registration policy/, error.message)
      assert_equal 0, attendee.signup_requests.count
    end
  end
end
# rubocop:enable GraphQL/ObjectDescription
