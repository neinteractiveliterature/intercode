Types::EventFiltersInputType = GraphQL::InputObjectType.define do
  name 'EventFiltersInput'

  input_field :category, types[types.String]
end
