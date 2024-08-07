# frozen_string_literal: true
class Types::TimespanWithMoneyValueType < Types::BaseObject
  field :finish, Types::DateType, null: true
  field :start, Types::DateType, null: true
  field :value, Types::MoneyType, null: false
end
