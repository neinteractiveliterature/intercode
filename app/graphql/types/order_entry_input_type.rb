class Types::OrderEntryInputType < Types::BaseInputObject
  argument :product_id, Integer, required: false, camelize: false
  argument :product_variant_id, Integer, required: false, camelize: false
  argument :quantity, Integer, required: false
  argument :price_per_item, Types::MoneyInputType, required: false, camelize: false
end
