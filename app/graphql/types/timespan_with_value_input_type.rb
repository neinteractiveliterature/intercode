Types::TimespanWithValueInputType = GraphQL::InputObjectType.define do
  name 'TimespanWithValueInput'

  input_field :start, Types::DateType
  input_field :finish, Types::DateType

  # Add additional typed value fields here as appropriate
  input_field :string_value, types.String
end
