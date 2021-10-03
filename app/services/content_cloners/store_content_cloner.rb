# frozen_string_literal: true
class ContentCloners::StoreContentCloner < ContentCloners::ContentClonerBase
  def clone(convention)
    @id_maps[:product_variants] = {}
    @id_maps[:products] =
      clone_with_id_map(source_convention.products, convention.products) do |product, cloned_product|
        cloned_product.pricing_structure =
          shift_pricing_structure_by_convention_distance(convention, product.pricing_structure)
        cloned_product.provides_ticket_type = @id_maps[:ticket_types][product.provides_ticket_type_id]
        cloned_product.save!
        variant_id_map = clone_with_id_map(product.product_variants, cloned_product.product_variants)
        @id_maps[:product_variants].merge!(variant_id_map)
      end
  end

  private

  def shift_pricing_structure_by_convention_distance(convention, value)
    return value unless value.pricing_strategy == 'scheduled_value'

    PricingStructure.new(
      value.attributes.merge(value: shift_scheduled_value_by_convention_distance(convention, value.value))
    )
  end
end
