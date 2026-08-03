# frozen_string_literal: true
# rubocop:disable GraphQL/ObjectDescription
require "test_helper"

class Mutations::CreateEventProposalTest < ActiveSupport::TestCase
  let(:convention) { create(:convention, accepting_proposals: true) }
  let(:event_category) { create(:event_category, convention:) }
  let(:profile) { create(:user_con_profile, convention:) }
  let(:source_registration_policy) do
    RegistrationPolicy.build_from_hash(
      buckets: [{ key: "unlimited", name: "Signups", slots_limited: false, anything: true }]
    )
  end
  let(:template_proposal) do
    create(
      :event_proposal,
      convention:,
      event_category:,
      owner: profile,
      registration_policy: source_registration_policy
    )
  end

  # Add a registration_policy form item so it's a "compatible item" to clone
  before do
    form = event_category.event_proposal_form
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

  CREATE_EVENT_PROPOSAL_MUTATION = <<~GRAPHQL
    mutation TestCreateEventProposal($eventCategoryId: ID!, $cloneEventProposalId: ID) {
      createEventProposal(
        input: { eventCategoryId: $eventCategoryId, cloneEventProposalId: $cloneEventProposalId }
      ) {
        event_proposal { id }
      }
    }
  GRAPHQL

  describe "cloning from an existing proposal with a registration policy" do
    let(:new_proposal) do
      result =
        execute_graphql_query(
          CREATE_EVENT_PROPOSAL_MUTATION,
          user_con_profile: profile,
          variables: {
            "eventCategoryId" => event_category.id.to_s,
            "cloneEventProposalId" => template_proposal.id.to_s
          }
        )

      EventProposal.find(result["data"]["createEventProposal"]["event_proposal"]["id"])
    end

    it "copies the registration policy into a new, independent row" do
      assert new_proposal.registration_policy.present?
      assert_not_equal template_proposal.registration_policy_id, new_proposal.registration_policy_id
    end

    it "copies bucket content equivalently, not by reference" do
      assert new_proposal.registration_policy.equivalent_to?(template_proposal.registration_policy)
      assert_not_equal(
        template_proposal.registration_policy.buckets.map(&:id),
        new_proposal.registration_policy.buckets.map(&:id)
      )
    end

    it "does not cascade-destroy the template's policy when the clone is destroyed" do
      new_proposal.destroy!
      assert RegistrationPolicy.exists?(template_proposal.reload.registration_policy_id)
    end
  end
end
