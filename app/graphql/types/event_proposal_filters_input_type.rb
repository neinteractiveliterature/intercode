Types::EventProposalFiltersInputType = GraphQL::InputObjectType.define do
  name 'EventProposalFiltersInput'

  input_field :title, types.String
  input_field :owner, types.String
  input_field :status, types[types.String]
end
