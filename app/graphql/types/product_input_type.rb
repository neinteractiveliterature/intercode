Types::ProductInputType = GraphQL::InputObjectType.define do
  name 'ProductInput'

  input_field :available, types.Boolean
  input_field :name, types.String
  input_field :description, types.String
  input_field :image, ApolloUploadServer::Upload
  input_field :price, Types::MoneyInputType
  input_field :product_variants, types[Types::ProductVariantInputType]
  input_field :delete_variant_ids, types[types.Int]
end
