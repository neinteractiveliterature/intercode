module ProductMutationHelper
  def self.create_or_update_variants(product, product_variants_fields)
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
  end
end
