class Types::ProductVariantInputType < Types::BaseInputObject

  argument :id, Integer, required: false
  argument :name, String, required: false
  argument :description, String, required: false
  argument :image, ApolloUploadServer::Upload, required: false
  argument :override_price, Types::MoneyInputType, required: false
end
