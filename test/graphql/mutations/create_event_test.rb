# frozen_string_literal: true
# rubocop:disable GraphQL/ObjectDescription
require "test_helper"

class Mutations::CreateEventTest < ActiveSupport::TestCase
  let(:convention) { create(:convention) }
  let(:admin_profile) { create(:user_con_profile, convention:, user: create(:site_admin)) }
  let(:event_category) { create(:event_category, convention:) }

  before do
    form = event_category.event_form
    section = form.form_sections.create!(title: "Section")
    section.form_items.create!(
      item_type: "free_text",
      identifier: "title",
      properties: {
        "lines" => 1,
        "caption" => "Title",
        "required" => true
      }
    )
    section.form_items.create!(
      item_type: "timespan",
      identifier: "length_seconds",
      properties: {
        "caption" => "Event Length",
        "required" => true
      }
    )
    section.form_items.create!(
      item_type: "registration_policy",
      identifier: "registration_policy",
      properties: {
        "presets" => [],
        "allow_custom" => true,
        "required" => false
      }
    )
  end

  CREATE_EVENT_MUTATION = <<~GRAPHQL
    mutation TestCreateEvent($eventCategoryId: ID!, $formResponseAttrsJson: String!) {
      createEvent(input: { event: { eventCategoryId: $eventCategoryId, form_response_attrs_json: $formResponseAttrsJson } }) {
        event { id }
      }
    }
  GRAPHQL

  def create_event(form_response_attrs)
    result =
      execute_graphql_query(
        CREATE_EVENT_MUTATION,
        user_con_profile: admin_profile,
        variables: {
          "eventCategoryId" => event_category.id.to_s,
          "formResponseAttrsJson" => form_response_attrs.to_json
        }
      )

    Event.find(result["data"]["createEvent"]["event"]["id"])
  end

  describe "with a registration_policy submitted" do
    it "builds an independent registration policy with the submitted buckets" do
      event =
        create_event(
          "title" => "A New Event",
          "length_seconds" => 3600,
          "registration_policy" => {
            "buckets" => [{ "key" => "unlimited", "name" => "Signups", "slots_limited" => false, "anything" => true }]
          }
        )

      assert event.registration_policy.present?
      assert_equal ["unlimited"], event.registration_policy.buckets.map(&:key)
    end
  end

  describe "without a registration_policy submitted" do
    it "defaults to an empty, fail-closed registration policy" do
      event = create_event("title" => "Another New Event", "length_seconds" => 3600)

      assert event.registration_policy.present?
      assert_equal [], event.registration_policy.buckets.to_a
      assert_not event.registration_policy.accepts_signups?
    end
  end

  describe "creating multiple events" do
    it "gives each event its own independent registration_policy row" do
      event1 =
        create_event(
          "title" => "Event One",
          "length_seconds" => 3600,
          "registration_policy" => {
            "buckets" => [{ "key" => "unlimited", "name" => "Signups", "slots_limited" => false, "anything" => true }]
          }
        )
      event2 =
        create_event(
          "title" => "Event Two",
          "length_seconds" => 3600,
          "registration_policy" => {
            "buckets" => [{ "key" => "unlimited", "name" => "Signups", "slots_limited" => false, "anything" => true }]
          }
        )

      assert_not_equal event1.registration_policy_id, event2.registration_policy_id
    end
  end
end
