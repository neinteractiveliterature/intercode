Types::UserType = GraphQL::ObjectType.define do
  name 'User'

  field :id, !types.Int
  field :privileges, types[types.String]
  field :name, types.String
  field :name_inverted, types.String
  field :first_name, types.String
  field :last_name, types.String
  field :email, types.String
end
