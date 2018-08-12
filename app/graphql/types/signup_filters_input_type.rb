Types::SignupFiltersInputType = GraphQL::InputObjectType.define do
  name 'SignupFiltersInput'

  input_field :name, types.String
  input_field :email, types.String
  input_field :state, types[types.String]
  input_field :bucket, types[types.String]
end
