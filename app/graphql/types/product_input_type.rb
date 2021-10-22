# frozen_string_literal: true
class Types::ProductInputType < Types::BaseInputObject
  argument :available, Boolean, required: false
  argument :name, String, required: false
  argument :description, String, required: false
  argument :image, ApolloUploadServer::Upload, required: false
  argument :pricing_structure, Types::PricingStructureInputType, required: false, camelize: false
  argument :product_variants, [Types::ProductVariantInputType], required: false, camelize: false
  argument :payment_options, [String], required: false, camelize: false
  argument :transitional_delete_variant_ids,
           [ID],
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the deleteVariantIds field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :delete_variant_ids, [ID], required: false, camelize: true
  argument :transitional_provides_ticket_type_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the providesTicketTypeId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :provides_ticket_type_id, ID, required: false, camelize: true
end
