Types::OrderFiltersInputType = GraphQL::InputObjectType.define do
  name 'OrderFiltersInput'

  input_field :user_name, types.String
  input_field :status, types.String
end
