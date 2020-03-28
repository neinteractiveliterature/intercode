module ProductMutationHelper
  def coerce_pricing_structure_input(input)
    return nil unless input

    value_field = case input[:pricing_strategy]
    when 'fixed' then :fixed_value
    when 'scheduled_value' then :scheduled_value
    end

    PricingStructure.new(
      pricing_strategy: input[:pricing_strategy],
      value: input[value_field]
    )
  end

  def create_or_update_variants(product, product_variants_fields)
    (product_variants_fields || []).each_with_index do |product_variant_fields, i|
      product_variant_attrs = product_variant_fields.merge(position: i + 1)
      variant_id = product_variant_attrs.delete(:id)
      product_variant_attrs[:override_pricing_structure] = coerce_pricing_structure_input(
        product_variant_fields[:override_pricing_structure]
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
