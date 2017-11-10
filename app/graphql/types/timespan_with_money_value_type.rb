Types::TimespanWithMoneyValueType = GraphQL::ObjectType.define do
  name "TimespanWithMoneyValue"

  field :start, Types::DateType
  field :finish, Types::DateType
  field :value, !Types::MoneyType
end
