# frozen_string_literal: true
class Types::ProductVariantInputType < Types::BaseInputObject
  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :name, String, required: false
  argument :description, String, required: false
  argument :image, ApolloUploadServer::Upload, required: false
  argument :override_pricing_structure, Types::PricingStructureInputType, required: false, camelize: false
end
