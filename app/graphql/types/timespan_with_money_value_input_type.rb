Types::TimespanWithMoneyValueInputType = GraphQL::InputObjectType.define do
  name 'TimespanWithMoneyValueInput'

  input_field :start, Types::DateType
  input_field :finish, Types::DateType
  input_field :value, !Types::MoneyInputType
end
