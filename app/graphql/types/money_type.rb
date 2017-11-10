Types::MoneyType = GraphQL::ObjectType.define do
  name "Money"

  field :cents, !types.Int
  field :currency, !types.String
end
