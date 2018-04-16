class Types::TimespanWithMoneyValueType < Types::BaseObject

  field :start, Types::DateType, null: true
  field :finish, Types::DateType, null: true
  field :value, Types::MoneyType, null: false
end
