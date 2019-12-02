class Types::EventProposalType < Types::BaseObject
  authorize_record

  field :id, Integer, null: false
  field :title, String, null: true
  field :status, String, null: false
  field :convention, Types::ConventionType, null: false
  field :submitted_at, Types::DateType, null: false
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

  association_loaders EventProposal, :convention, :owner, :event, :event_category

  field :form_response_attrs_json, String, null: true

  def form_response_attrs_json
    AssociationLoader.for(EventProposal, :event_category).load(object).then do |event_category|
      AssociationLoader.for(EventCategory, :event_proposal_form).load(event_category)
    end.then do |event_proposal_form|
      FormResponsePresenter.new(event_proposal_form, object).as_json.to_json
    end
  end

  def form_response_changes
    AssociationLoader.for(EventProposal, :form_response_changes).load(object).then do |changes|
      CompactingFormResponseChangesPresenter.new(changes).compacted_changes
    end
  end
end
