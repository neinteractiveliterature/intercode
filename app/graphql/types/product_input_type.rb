# frozen_string_literal: true
class Types::ProductInputType < Types::BaseInputObject
  argument :available, Boolean, required: false
  argument :name, String, required: false
  argument :description, String, required: false
  argument :image, ApolloUploadServer::Upload, required: false
  argument :pricing_structure, Types::PricingStructureInputType, required: false, camelize: false
  argument :product_variants, [Types::ProductVariantInputType], required: false, camelize: false
  argument :payment_options, [String], required: false, camelize: false
  argument :delete_variant_ids, [Integer], required: false, camelize: false
  argument :provides_ticket_type_id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false,
           camelize: false
  argument :transitional_provides_ticket_type_id, ID, required: false, camelize: true
end
