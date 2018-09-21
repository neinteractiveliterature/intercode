Types::EventProposalType = GraphQL::ObjectType.define do
  name 'EventProposal'

  field :id, !types.Int
  field :form_response_attrs_json, types.String do
    resolve -> (obj, _args, ctx) do
      FormResponsePresenter.new(ctx[:convention].event_proposal_form, obj).as_json.to_json
    end
  end
  field :title, types.String
  field :status, !types.String
  field :convention, !Types::ConventionType
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
  field :event, Types::EventType
end
