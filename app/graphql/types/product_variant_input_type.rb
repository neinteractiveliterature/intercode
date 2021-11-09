# frozen_string_literal: true
class Types::ProductVariantInputType < Types::BaseInputObject
  argument :id, ID, required: false
  argument :name, String, required: false
  argument :description, String, required: false
  argument :image, ApolloUploadServer::Upload, required: false
  argument :override_pricing_structure, Types::PricingStructureInputType, required: false, camelize: false
end
