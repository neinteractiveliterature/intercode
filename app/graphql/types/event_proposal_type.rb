# frozen_string_literal: true
class Types::EventProposalType < Types::BaseObject
  include FormResponseAttrsFields

  authorize_record

  field :id, ID, null: false

  field :form, Types::FormType, null: true

  field :admin_notes, String, null: true do
    authorize_action :read_admin_notes
  end
  field :convention, Types::ConventionType, null: false
  field :created_at, Types::DateType, null: false
  field :length_seconds, Integer, null: true
  field :registration_policy, Types::RegistrationPolicyType, null: true
  field :status, String, null: false
  field :submitted_at, Types::DateType, null: true
  field :title, String, null: true
  field :updated_at, Types::DateType, null: false

  field :event, Types::EventType, null: true
  field :event_category, Types::EventCategoryType, null: false
  field :form_response_changes, [Types::FormResponseChangeType], null: false
  field :images, [Types::ActiveStorageAttachmentType], null: false
  field :owner, Types::UserConProfileType, null: false

  association_loaders EventProposal, :convention, :owner, :event, :event_category

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
