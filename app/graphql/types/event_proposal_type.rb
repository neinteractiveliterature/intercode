# frozen_string_literal: true
class Types::EventProposalType < Types::BaseObject
  include FormResponseAttrsFields

  authorize_record

  field :id, ID, null: false
  field :title, String, null: true
  field :status, String, null: false
  field :convention, Types::ConventionType, null: false
  field :submitted_at, Types::DateType, null: true
  field :created_at, Types::DateType, null: false
  field :updated_at, Types::DateType, null: false
  field :registration_policy, Types::RegistrationPolicyType, null: true
  field :length_seconds, Integer, null: true
  field :admin_notes, String, null: true do
    authorize_action :read_admin_notes
  end

  field :owner, Types::UserConProfileType, null: false
  field :event, Types::EventType, null: true
  field :event_category, Types::EventCategoryType, null: false
  field :form_response_changes, [Types::FormResponseChangeType], null: false
  field :images, [Types::ActiveStorageAttachmentType], null: false

  association_loaders EventProposal, :convention, :owner, :event, :event_category

  field :form, Types::FormType, null: true

  def form
    event_category = dataloader.with(Sources::ActiveRecordAssociation, EventProposal, :event_category).load(object)
    dataloader.with(Sources::ActiveRecordAssociation, EventCategory, :event_proposal_form).load(event_category)
  end

  def form_response_changes
    changes = dataloader.with(Sources::ActiveRecordAssociation, EventProposal, :form_response_changes).load(object)
    CompactingFormResponseChangesPresenter.new(changes).compacted_changes
  end

  def images
    ActiveStorageAttachmentLoader.for(EventProposal, :images).load(object)
  end
end
