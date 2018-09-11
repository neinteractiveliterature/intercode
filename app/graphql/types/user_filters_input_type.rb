Types::UserFiltersInputType = GraphQL::InputObjectType.define do
  name 'UserFiltersInput'

  input_field :name, types.String
  input_field :email, types.String
  input_field :privileges, types[types.String]
end
