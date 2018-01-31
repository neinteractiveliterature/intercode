Types::TimespanWithValueType = GraphQL::ObjectType.define do
  name 'TimespanWithValue'

  field :start, Types::DateType
  field :finish, Types::DateType
  field :value, !types.String
end
