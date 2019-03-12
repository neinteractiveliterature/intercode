class Types::OrderInputType < Types::BaseInputObject
  argument :payment_note, String, required: false, camelize: false
end
