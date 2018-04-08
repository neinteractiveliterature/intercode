Mutations::UpdateProduct = GraphQL::Relay::Mutation.define do
  name 'UpdateProduct'
  return_field :product, Types::ProductType

  input_field :id, !types.Int
  input_field :product, !Types::ProductInputType

  resolve ->(_obj, args, ctx) {
    product = ctx[:convention].products.includes(:product_variants).find(args[:id])
    product_fields = args[:product].to_h.deep_symbolize_keys

    product_fields[:price] = MoneyHelper.coerce_money_input(product_fields[:price])

    product_variants_fields = product_fields.delete(:product_variants)
    (product_variants_fields || []).each_with_index do |product_variant_fields, i|
      product_variant_attrs = product_variant_fields.merge(position: i + 1)
      variant_id = product_variant_attrs.delete(:id)
      product_variant_attrs[:override_price] = MoneyHelper.coerce_money_input(
        product_variant_attrs[:override_price]
      )

      if variant_id
        variant = product.product_variants.find { |v| v.id == variant_id }
        variant.update!(product_variant_attrs)
      else
        product.product_variants.create!(product_variant_attrs)
      end
    end

    (product_fields.delete(:delete_variant_ids) || []).each do |variant_id|
      product.product_variants.find { |v| v.id == variant_id }.destroy!
    end
    product.product_variants.reload

    product.update!(product_fields)

    { product: product }
  }
end
