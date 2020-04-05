class Types::ProductVariantInputType < Types::BaseInputObject
  argument :id, Integer, required: false
  argument :name, String, required: false
  argument :description, String, required: false
  argument :image, ApolloUploadServer::Upload, required: false
  argument :override_pricing_structure, Types::PricingStructureInputType,
    required: false, camelize: false
end
