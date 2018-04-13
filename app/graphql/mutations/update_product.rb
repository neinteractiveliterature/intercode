Mutations::UpdateProduct = GraphQL::Relay::Mutation.define do
  name 'UpdateProduct'
  return_field :product, Types::ProductType

  input_field :id, !types.Int
  input_field :product, !Types::ProductInputType

  resolve ->(_obj, args, ctx) {
    product = ctx[:convention].products.includes(:product_variants).find(args[:id])
    product_fields = args[:product].to_h.deep_symbolize_keys

    product_fields[:price] = MoneyHelper.coerce_money_input(product_fields[:price])

    ProductMutationHelper.create_or_update_variants(
      product,
      product_fields.delete(:product_variants)
    )

    (product_fields.delete(:delete_variant_ids) || []).each do |variant_id|
      product.product_variants.find { |v| v.id == variant_id }.destroy!
    end
    product.product_variants.reload

    product.update!(product_fields)

    { product: product }
  }
end
