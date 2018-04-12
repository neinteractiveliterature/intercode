Mutations::DeleteProduct = GraphQL::Relay::Mutation.define do
  name 'DeleteProduct'
  return_field :product, Types::ProductType

  input_field :id, !types.Int

  resolve ->(_obj, args, ctx) {
    product = ctx[:convention].products.find(args[:id])
    if product.order_entries.any?
      raise StandardError, 'This product cannot be deleted because it has been ordered.'
    end

    product.destroy!

    { product: product }
  }
end
