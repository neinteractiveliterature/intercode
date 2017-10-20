Types::TimespanWithValueType = GraphQL::ObjectType do
  name "TimespanWithValue"

  field :start, Types::DateType
  field :finish, Types::DateType
  field :value, !types.String
end
