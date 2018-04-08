Types::ProductVariantInputType = GraphQL::InputObjectType.define do
  name 'ProductVariantInput'

  input_field :id, types.Int
  input_field :name, types.String
  input_field :description, types.String
  input_field :image, ApolloUploadServer::Upload
  input_field :override_price, Types::MoneyInputType
end
