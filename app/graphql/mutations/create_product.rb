Mutations::CreateProduct = GraphQL::Relay::Mutation.define do
  name 'CreateProduct'
  return_field :product, Types::ProductType

  input_field :product, !Types::ProductInputType

  resolve ->(_obj, args, ctx) {
    product = ctx[:convention].products.new
    product_fields = args[:product].to_h.deep_symbolize_keys

    product_fields[:price] = MoneyHelper.coerce_money_input(product_fields[:price])

    ProductMutationHelper.create_or_update_variants(
      product,
      product_fields.delete(:product_variants)
    )
    product.product_variants.reload

    product_fields.delete(:delete_variant_ids) # no point even trying to process this on a create

    product.update!(product_fields)

    { product: product }
  }
end
