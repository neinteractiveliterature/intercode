# frozen_string_literal: true
class Types::OrderEntryInputType < Types::BaseInputObject
  argument :product_id, ID, required: false, camelize: true
  argument :product_variant_id, ID, required: false, camelize: true
  argument :quantity, Integer, required: false
  argument :price_per_item, Types::MoneyInputType, required: false, camelize: false
  argument :ticket_id, ID, required: false, camelize: true
  argument :run_id, ID, required: false, camelize: true
end
