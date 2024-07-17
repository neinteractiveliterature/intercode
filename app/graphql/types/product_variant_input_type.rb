# frozen_string_literal: true
class Types::ProductVariantInputType < Types::BaseInputObject
  argument :description, String, required: false
  argument :id, ID, required: false
  argument :image,
           ApolloUploadServer::Upload,
           required: false,
           prepare: ->(upload, _) {
             upload&.__getobj__ # Unwrap value for ActiveStorage
           }
  argument :name, String, required: false
  argument :override_pricing_structure, Types::PricingStructureInputType, required: false, camelize: false
end
