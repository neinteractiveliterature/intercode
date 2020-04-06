class Mutations::CreateProduct < Mutations::BaseMutation
  include ProductMutationHelper

  field :product, Types::ProductType, null: false

  argument :product, Types::ProductInputType, required: true

  authorize_create_convention_associated_model :products

  def resolve(**args)
    product_fields = args[:product].to_h.deep_symbolize_keys
    product_fields[:pricing_structure] = coerce_pricing_structure_input(
      product_fields[:pricing_structure]
    )
    product_variant_fields = product_fields.delete(:product_variants)
    product_fields.delete(:delete_variant_ids) # no point even trying to process this on a create

    product = convention.products.create!(product_fields)

    create_or_update_variants(product, product_variant_fields)
    product.product_variants.reload

    { product: product }
  end
end
