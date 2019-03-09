Types::EventProposalType = GraphQL::ObjectType.define do
  name 'EventProposal'

  field :id, !types.Int
  field :form_response_attrs_json, types.String do
    resolve -> (obj, _args, ctx) do
      AssociationLoader.for(EventProposal, :event_category).load(obj).then do |event_category|
        AssociationLoader.for(EventCategory, :event_proposal_form).load(event_category)
      end.then do |event_proposal_form|
        FormResponsePresenter.new(event_proposal_form, obj).as_json.to_json
      end
    end
  end
  field :title, types.String
  field :status, !types.String
  field :convention, Types::ConventionType.to_non_null_type
  field :submitted_at, !Types::DateType
  field :created_at, !Types::DateType
  field :updated_at, !Types::DateType

  field :registration_policy, Types::RegistrationPolicyType
  field :length_seconds, types.Int

  field :owner, !Types::UserConProfileType do
    resolve -> (obj, _args, _ctx) do
      AssociationLoader.for(EventProposal, :owner).load(obj)
    end
  end

  field :event, Types::EventType do
    resolve -> (obj, _args, _ctx) do
      AssociationLoader.for(EventProposal, :event).load(obj)
    end
  end

  field :event_category, Types::EventCategoryType.to_non_null_type do
    resolve -> (obj, _args, _ctx) do
      AssociationLoader.for(EventProposal, :event_category).load(obj)
    end
  end

  field :admin_notes, types.String do
    guard -> (obj, _args, ctx) do
      ctx[:current_ability].can?(:read_admin_notes, obj)
    end
  end
end
