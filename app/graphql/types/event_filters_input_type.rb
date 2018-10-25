Types::EventFiltersInputType = GraphQL::InputObjectType.define do
  name 'EventFiltersInput'

  input_field :category, types.String
end
