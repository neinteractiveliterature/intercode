# frozen_string_literal: true
class Types::ProductInputType < Types::BaseInputObject
  argument :available, Boolean, required: false
  argument :clickwrap_agreement, String, required: false, camelize: true
  argument :delete_variant_ids, [ID], required: false, camelize: true
  argument :description, String, required: false
  argument :image,
           ApolloUploadServer::Upload,
           required: false,
           prepare: ->(upload, _) do
             upload&.__getobj__ # Unwrap value for ActiveStorage
           end
  argument :name, String, required: false
  argument :payment_options, [String], required: false, camelize: false
  argument :pricing_structure, Types::PricingStructureInputType, required: false, camelize: false
  argument :product_variants, [Types::ProductVariantInputType], required: false, camelize: false
  argument :provides_ticket_type_id, ID, required: false, camelize: true
end
