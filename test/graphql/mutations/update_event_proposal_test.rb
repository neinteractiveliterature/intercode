# frozen_string_literal: true
# rubocop:disable GraphQL/ObjectDescription
require "test_helper"

class Mutations::UpdateEventProposalTest < ActiveSupport::TestCase
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
  let(:event_proposal) do
    create(:event_proposal, convention:, status: "proposed", registration_policy: old_registration_policy)
  end

  # Add a registration_policy form item so it passes through filter_form_response_attributes_for_assignment
  before do
    form = event_proposal.event_category.event_proposal_form
    section = form.form_sections.create!(title: "Section")
    section.form_items.create!(
      item_type: "registration_policy",
      identifier: "registration_policy",
      properties: {
        "identifier" => "registration_policy",
        "presets" => [],
        "allow_custom" => true
      }
    )
  end

  UPDATE_EVENT_PROPOSAL_MUTATION = <<~GRAPHQL
    mutation TestUpdateEventProposal($id: ID!, $formResponseAttrsJson: String!) {
      updateEventProposal(input: { id: $id, event_proposal: { form_response_attrs_json: $formResponseAttrsJson } }) {
        event_proposal { id }
      }
    }
  GRAPHQL

  describe "updating registration_policy" do
    before do
      execute_graphql_query(
        UPDATE_EVENT_PROPOSAL_MUTATION,
        user_con_profile: admin_profile,
        variables: {
          "id" => event_proposal.id.to_s,
          "formResponseAttrsJson" => { "registration_policy" => new_registration_policy.as_json }.to_json
        }
      )
    end

    it "creates a FormResponseChange for registration_policy" do
      assert FormResponseChange.exists?(response: event_proposal, field_identifier: "registration_policy")
    end

    it "records the old policy as previous_value" do
      change = FormResponseChange.find_by!(response: event_proposal, field_identifier: "registration_policy")
      assert_equal old_registration_policy.as_json, change.previous_value
    end

    it "records the new policy as new_value" do
      change = FormResponseChange.find_by!(response: event_proposal, field_identifier: "registration_policy")
      assert_equal new_registration_policy.as_json, change.new_value
    end

    it "stores different previous_value and new_value" do
      change = FormResponseChange.find_by!(response: event_proposal, field_identifier: "registration_policy")
      assert_not_equal change.previous_value, change.new_value
    end
  end

  describe "updating with unchanged registration_policy" do
    it "does not create a FormResponseChange" do
      execute_graphql_query(
        UPDATE_EVENT_PROPOSAL_MUTATION,
        user_con_profile: admin_profile,
        variables: {
          "id" => event_proposal.id.to_s,
          "formResponseAttrsJson" => { "registration_policy" => old_registration_policy.as_json }.to_json
        }
      )

      assert_equal(0, FormResponseChange.where(response: event_proposal, field_identifier: "registration_policy").count)
    end
  end
end
