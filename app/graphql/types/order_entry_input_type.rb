# frozen_string_literal: true
class Types::OrderEntryInputType < Types::BaseInputObject
  argument :transitional_product_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the productId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :product_id, ID, required: false, camelize: true
  argument :transitional_product_variant_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the productVariantId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :product_variant_id, ID, required: false, camelize: true
  argument :quantity, Integer, required: false
  argument :price_per_item, Types::MoneyInputType, required: false, camelize: false
  argument :transitional_ticket_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the ticketId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :ticket_id, ID, required: false, camelize: true
end
