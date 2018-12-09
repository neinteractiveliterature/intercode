Types::EventFiltersInputType = GraphQL::InputObjectType.define do
  name 'EventFiltersInput'

  input_field :category, types[types.String]
  input_field :title, types.String
end
