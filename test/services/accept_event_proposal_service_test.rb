# frozen_string_literal: true
require "test_helper"

class AcceptEventProposalServiceTest < ActiveSupport::TestCase
  let(:convention) { create(:convention) }
  let(:event_category) { create(:event_category, convention: convention) }
  let(:event_proposal) do
    build(:event_proposal, event_category: event_category, convention: convention).tap do |proposal|
      proposal.assign_default_values_from_form_items(proposal.event_category.event_proposal_form.form_items)
      proposal.save!
    end
  end

  before do
    ClearCmsContentService.new(convention: convention).call!
    LoadCmsContentSetService.new(convention: convention, content_set_name: "standard").call!
    event_category.update!(
      event_proposal_form: convention.forms.find_by!(title: "Proposal form"),
      event_form: convention.forms.find_by!(title: "Regular event form")
    )
  end

  it "creates an event" do
    assert_difference "Event.count", 1 do
      AcceptEventProposalService.new(event_proposal: event_proposal).call!
    end
  end

  it "copies fields that do not match in name" do
    event_proposal.assign_form_response_attributes(authors: "Alexander Graham Bell", player_communications: "ahoy hoy!")
    event_proposal.save!

    event = AcceptEventProposalService.new(event_proposal: event_proposal).call!.event
    assert_equal "Alexander Graham Bell", event.author
    assert_equal "ahoy hoy!", event.participant_communications
  end

  it "copies fields that are not explicitly mapped" do
    event_category.event_proposal_form.form_sections.first.form_items.create!(
      identifier: "secret_password",
      item_type: "free_text",
      properties: {
        caption: "Secret password",
        lines: 1
      }
    )
    event_category.event_form.form_sections.first.form_items.create!(
      identifier: "secret_password",
      item_type: "free_text",
      properties: {
        caption: "Secret password",
        lines: 1
      }
    )
    event_proposal.assign_form_response_attributes(secret_password: "swordfish")
    event_proposal.save!

    event = AcceptEventProposalService.new(event_proposal: event_proposal).call!.event
    assert_equal "swordfish", event.read_form_response_attribute(:secret_password)
  end

  it "copies event_email correctly" do
    event_proposal.assign_form_response_attributes(
      event_email: {
        email: "test@example.com",
        con_mail_destination: "event_email"
      }
    )
    event_proposal.save!

    event = AcceptEventProposalService.new(event_proposal: event_proposal).call!.event
    assert_equal "test@example.com", event.email
    assert_equal "event_email", event.con_mail_destination
  end

  it "copies the registration policy into a new, independent row" do
    event_proposal.update!(
      registration_policy:
        RegistrationPolicy.build_from_hash(
          buckets: [{ key: "unlimited", name: "Signups", slots_limited: false, anything: true }]
        )
    )

    event = AcceptEventProposalService.new(event_proposal: event_proposal).call!.event

    assert event.registration_policy.present?
    assert_not_equal event_proposal.registration_policy_id, event.registration_policy_id
    assert_not_equal(event_proposal.registration_policy.buckets.map(&:id), event.registration_policy.buckets.map(&:id))
    # Not equivalent_to? -- it matches by id (see #11897), and this clone deliberately has
    # different ids from its source (see build_from_hash_as_clone). Matches by key instead.
    assert_registration_policies_have_equivalent_buckets(event_proposal.registration_policy, event.registration_policy)
  end

  it "copies attached images" do
    File.open(__FILE__) do |f|
      event_proposal.images.attach({ io: f, filename: "testfile", content_type: "application/octet-stream" })
    end
    event_proposal.save!

    event = AcceptEventProposalService.new(event_proposal: event_proposal).call!.event
    assert_equal 1, event.images.attachments.size
    assert_equal event_proposal.images.blobs.first, event.images.blobs.first
    assert_not_equal event_proposal.images.attachments.first, event.images.attachments.first
  end
end
