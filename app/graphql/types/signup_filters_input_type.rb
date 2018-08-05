Types::SignupFiltersInputType = GraphQL::InputObjectType.define do
  name 'SignupFiltersInput'

  input_field :user_name, types.String
  input_field :status, types.String
end
