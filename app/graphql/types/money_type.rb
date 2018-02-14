Types::MoneyType = GraphQL::ObjectType.define do
  name 'Money'

  field :fractional, !types.Int
  field :currency_code, !types.String do
    resolve ->(obj, _args, _ctx) { obj.currency.iso_code }
  end
end
