# frozen_string_literal: true
class Types::TimespanWithMoneyValueInputType < Types::BaseInputObject
  argument :finish, Types::DateType, required: false
  argument :start, Types::DateType, required: false
  argument :value, Types::MoneyInputType, required: true
end
