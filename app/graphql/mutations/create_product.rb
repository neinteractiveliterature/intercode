Mutations::CreateProduct = GraphQL::Relay::Mutation.define do
  name 'CreateProduct'
  return_field :product, Types::ProductType

  input_field :product, !Types::ProductInputType

  resolve ->(_obj, args, ctx) {
    product_fields = args[:product].to_h.deep_symbolize_keys
    product_fields[:price] = MoneyHelper.coerce_money_input(product_fields[:price])
    product_variant_fields = product_fields.delete(:product_variants)
    product_fields.delete(:delete_variant_ids) # no point even trying to process this on a create

    product = ctx[:convention].products.create!(product_fields)

    ProductMutationHelper.create_or_update_variants(product, product_variant_fields)
    product.product_variants.reload

    { product: product }
  }
end
