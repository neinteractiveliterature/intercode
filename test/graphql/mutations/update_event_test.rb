# frozen_string_literal: true
# rubocop:disable GraphQL/ObjectDescription
require "test_helper"

class Mutations::UpdateEventTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  let(:convention) { create(:convention) }
  let(:admin_profile) { create(:user_con_profile, convention:, user: create(:site_admin)) }
  let(:old_registration_policy) do
    RegistrationPolicy.new(buckets: [{ key: "unlimited", slots_limited: false, anything: true }])
  end
  let(:new_registration_policy) do
    RegistrationPolicy.new(
      buckets: [
        { key: "players", name: "Players", slots_limited: true, total_slots: 4 },
        { key: "anything", name: "Anything", slots_limited: true, total_slots: 2, anything: true }
      ]
    )
  end
  let(:event) { create(:event, convention:, registration_policy: old_registration_policy) }

  UPDATE_EVENT_MUTATION = <<~GRAPHQL
    mutation TestUpdateEvent($id: ID!, $formResponseAttrsJson: String!) {
      updateEvent(input: { id: $id, event: { form_response_attrs_json: $formResponseAttrsJson } }) {
        event { id }
      }
    }
  GRAPHQL

  describe "updating registration_policy" do
    before do
      execute_graphql_query(
        UPDATE_EVENT_MUTATION,
        user_con_profile: admin_profile,
        variables: {
          "id" => event.id.to_s,
          "formResponseAttrsJson" => { "registration_policy" => new_registration_policy.as_json }.to_json
        }
      )
    end

    it "creates a FormResponseChange for registration_policy" do
      assert FormResponseChange.exists?(response: event, field_identifier: "registration_policy")
    end

    it "records the old policy as previous_value" do
      change = FormResponseChange.find_by!(response: event, field_identifier: "registration_policy")
      assert_equal old_registration_policy.as_json, change.previous_value
    end

    it "records the new policy as new_value" do
      change = FormResponseChange.find_by!(response: event, field_identifier: "registration_policy")
      assert_equal new_registration_policy.as_json, change.new_value
    end

    it "stores different previous_value and new_value" do
      change = FormResponseChange.find_by!(response: event, field_identifier: "registration_policy")
      assert_not_equal change.previous_value, change.new_value
    end
  end

  describe "notification email for registration_policy changes" do
    it "includes registration_policy changes when notifying" do
      change_profile = create(:user_con_profile, convention:)
      FormResponseChange.create!(
        response: event,
        user_con_profile: change_profile,
        field_identifier: "registration_policy",
        previous_value: old_registration_policy.as_json,
        new_value: new_registration_policy.as_json,
        compacted: true
      )

      sent_changes = nil
      NotifyFormResponseChangesService.new(
        scope: FormResponseChange.where(response_type: "Event"),
        send_mail: ->(_event_id, compacted_changes) { sent_changes = compacted_changes }
      ).call!

      assert_not_nil sent_changes
      assert_equal 1, sent_changes.size
      assert_equal "registration_policy", sent_changes.first.field_identifier
      assert_not_equal sent_changes.first.previous_value, sent_changes.first.new_value
    end
  end
end
