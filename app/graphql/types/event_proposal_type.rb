Types::EventProposalType = GraphQL::ObjectType.define do
  name 'EventProposal'

  field :id, !types.Int
  field :form_response_attrs_json, types.String do
    resolve -> (obj, _args, ctx) do
      FormResponsePresenter.new(ctx[:convention].event_proposal_form, obj).as_json.to_json
    end
  end
end
