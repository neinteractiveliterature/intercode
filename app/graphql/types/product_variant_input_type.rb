# frozen_string_literal: true
class Types::ProductVariantInputType < Types::BaseInputObject
  argument :id, ID, required: false
  argument :name, String, required: false
  argument :description, String, required: false
  argument :image,
           ApolloUploadServer::Upload,
           required: false,
           prepare: ->(upload, _) {
             upload&.__getobj__ # Unwrap value for ActiveStorage
           }
  argument :override_pricing_structure, Types::PricingStructureInputType, required: false, camelize: false
end
