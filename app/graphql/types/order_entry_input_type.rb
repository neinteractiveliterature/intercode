class Types::OrderEntryInputType < Types::BaseInputObject

  argument :product_id, Integer, required: false
  argument :product_variant_id, Integer, required: false
  argument :quantity, Integer, required: false
end
