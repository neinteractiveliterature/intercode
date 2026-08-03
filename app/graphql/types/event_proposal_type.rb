# frozen_string_literal: true
class Types::EventProposalType < Types::BaseObject
  description "A proposal for a new event, submitted by a convention attendee for review"

  include FormResponseAttrsFields

  authorize_record

  field :id, ID, null: false, description: "The ID of this event proposal"

  field :form, Types::FormType, null: true, description: "The form used for this event proposal"

  field :admin_notes, String, null: true, description: "Admin-only notes about this event proposal" do
    authorize_action :read_admin_notes
  end
  field :convention, Types::ConventionType, null: false, description: "The convention this event proposal belongs to"
  field :created_at, Types::DateType, null: false, description: "When this event proposal was created"
  field :length_seconds, Integer, null: true, description: "The proposed length of the event in seconds"
  field :registration_policy,
        Types::RegistrationPolicyType,
        null: true,
        description: "The proposed registration policy for this event"
  field :status, String, null: false, description: "The status of this event proposal (draft, submitted, etc.)"
  field :submitted_at, Types::DateType, null: true, description: "When this event proposal was submitted for review"
  field :title, String, null: true, description: "The proposed title of the event"
  field :updated_at, Types::DateType, null: false, description: "When this event proposal was last updated"

  field :event, Types::EventType, null: true, description: "The event created from this proposal, if it was accepted"
  field :event_category, Types::EventCategoryType, null: false, description: "The category of this event proposal"
  field :form_response_changes,
        [Types::FormResponseChangeType],
        null: false,
        description: "The history of changes to this event proposal's form response"
  field :images,
        [Types::ActiveStorageAttachmentType],
        null: false,
        description: "Images attached to this event proposal"
  field :owner,
        Types::UserConProfileType,
        null: false,
        description: "The convention attendee who submitted this proposal"

  association_loaders EventProposal, :convention, :owner, :event, :event_category, :registration_policy

  def form
    event_category = dataloader.with(Sources::ActiveRecordAssociation, EventProposal, :event_category).load(object)
    dataloader.with(Sources::ActiveRecordAssociation, EventCategory, :event_proposal_form).load(event_category)
  end

  def form_response_changes
    changes = dataloader.with(Sources::ActiveRecordAssociation, EventProposal, :form_response_changes).load(object)
    CompactingFormResponseChangesPresenter.new(changes).compacted_changes
  end

  def images
    dataloader.with(Sources::ActiveStorageAttachment, EventProposal, :images).load(object)
  end
end
