class Types::EventProposalType < Types::BaseObject

  field :id, Integer, null: false
  field :form_response_attrs_json, String, null: true

  def form_response_attrs_json
    FormResponsePresenter.new(@context[:convention].event_proposal_form, @object).as_json.to_json
  end
end
