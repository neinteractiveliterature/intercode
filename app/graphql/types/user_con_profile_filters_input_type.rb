Types::UserConProfileFiltersInputType = GraphQL::InputObjectType.define do
  name 'UserConProfileFiltersInput'

  input_field :name, types.String
  input_field :email, types.String
  input_field :ticket_type_id, types[types.Int]
  input_field :privileges, types[types.String]
end
