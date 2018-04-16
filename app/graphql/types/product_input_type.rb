class Types::ProductInputType < Types::BaseInputObject

  argument :available, Boolean, required: false
  argument :name, String, required: false
  argument :description, String, required: false
  argument :image, ApolloUploadServer::Upload, required: false
  argument :price, Types::MoneyInputType, required: false
  argument :product_variants, [Types::ProductVariantInputType, null: true], required: false
  argument :delete_variant_ids, [Integer, null: true], required: false
end
