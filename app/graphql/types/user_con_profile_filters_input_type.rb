Types::UserConProfileFiltersInputType = GraphQL::InputObjectType.define do
  name 'UserConProfileFiltersInput'

  input_field :name, types.String
  input_field :first_name, types.String
  input_field :last_name, types.String
  input_field :email, types.String
  input_field :ticket, types[types.String]
  input_field :privileges, types[types.String]
  input_field :attending, types.Boolean
end
