class Types::TimespanWithMoneyValueInputType < Types::BaseInputObject

  argument :start, Types::DateType, required: false
  argument :finish, Types::DateType, required: false
  argument :value, Types::MoneyInputType, required: true
end
