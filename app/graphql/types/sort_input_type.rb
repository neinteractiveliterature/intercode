Types::SortInputType = GraphQL::InputObjectType.define do
  name 'SortInput'

  input_field :field, !types.String
  input_field :desc, !types.Boolean
end
