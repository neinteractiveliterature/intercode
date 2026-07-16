# frozen_string_literal: true
# rubocop:disable GraphQL/ObjectDescription
require "test_helper"

class Mutations::CreateFillerEventTest < ActiveSupport::TestCase
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

  CREATE_FILLER_EVENT_MUTATION = <<~GRAPHQL
    mutation TestCreateFillerEvent($eventCategoryId: ID!, $formResponseAttrsJson: String!) {
      createFillerEvent(input: { event: { eventCategoryId: $eventCategoryId, form_response_attrs_json: $formResponseAttrsJson } }) {
        event { id }
      }
    }
  GRAPHQL

  describe "with a registration_policy submitted" do
    it "builds an independent registration policy with the submitted buckets" do
      form_response_attrs = {
        "title" => "A Filler Event",
        "length_seconds" => 3600,
        "registration_policy" => {
          "buckets" => [{ "key" => "unlimited", "name" => "Signups", "slots_limited" => false, "anything" => true }]
        }
      }

      result =
        execute_graphql_query(
          CREATE_FILLER_EVENT_MUTATION,
          user_con_profile: admin_profile,
          variables: {
            "eventCategoryId" => event_category.id.to_s,
            "formResponseAttrsJson" => form_response_attrs.to_json
          }
        )

      event = Event.find(result["data"]["createFillerEvent"]["event"]["id"])
      assert event.registration_policy.present?
      assert_equal ["unlimited"], event.registration_policy.buckets.map(&:key)
    end
  end
end
