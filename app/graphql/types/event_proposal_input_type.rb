Types::EventProposalInputType = GraphQL::InputObjectType.define do
  name 'EventProposalInput'

  input_field :form_response_attrs_json, types.String
end
