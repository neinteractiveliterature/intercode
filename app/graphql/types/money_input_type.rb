Types::MoneyInputType = GraphQL::InputObjectType.define do
  name 'MoneyInput'

  input_field :fractional, !types.Int
  input_field :currency_code, !types.String
end
