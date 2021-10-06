# frozen_string_literal: true
class Types::ProductVariantInputType < Types::BaseInputObject
  argument :id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :name, String, required: false
  argument :description, String, required: false
  argument :image, ApolloUploadServer::Upload, required: false
  argument :override_pricing_structure, Types::PricingStructureInputType, required: false, camelize: false
end
