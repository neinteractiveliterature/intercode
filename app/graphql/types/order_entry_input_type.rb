# frozen_string_literal: true
class Types::OrderEntryInputType < Types::BaseInputObject
  argument :product_id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false,
           camelize: false
  argument :transitional_product_id, ID, required: false, camelize: true
  argument :product_variant_id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false,
           camelize: false
  argument :transitional_product_variant_id, ID, required: false, camelize: true
  argument :quantity, Integer, required: false
  argument :price_per_item, Types::MoneyInputType, required: false, camelize: false
  argument :ticket_id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false,
           camelize: false
  argument :transitional_ticket_id, ID, required: false, camelize: true
end
