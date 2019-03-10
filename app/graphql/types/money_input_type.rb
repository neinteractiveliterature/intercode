class Types::MoneyInputType < Types::BaseInputObject
  argument :fractional, Integer, required: true
  argument :currency_code, String, required: true, camelize: false
end
