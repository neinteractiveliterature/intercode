class Types::OrderInputType < Types::BaseInputObject
  argument :payment_amount, Types::MoneyInputType, required: false, camelize: false
  argument :payment_note, String, required: false, camelize: false
end
