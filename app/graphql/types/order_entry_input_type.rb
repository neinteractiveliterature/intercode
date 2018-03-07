Types::OrderEntryInputType = GraphQL::InputObjectType.define do
  name 'OrderEntryInput'

  input_field :product_id, types.Int
  input_field :product_variant_id, types.Int
  input_field :quantity, types.Int
end
