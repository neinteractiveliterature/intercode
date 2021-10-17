# frozen_string_literal: true
class Mutations::CreateProduct < Mutations::BaseMutation
  include ProductMutationHelper

  field :product, Types::ProductType, null: false

  argument :product, Types::ProductInputType, required: true

  authorize_create_convention_associated_model :products

  def resolve(**args)
    product_fields =
      process_transitional_ids_in_input(args[:product].to_h, :provides_ticket_type_id).deep_symbolize_keys
    product_fields[:pricing_structure] = coerce_pricing_structure_input(product_fields[:pricing_structure])
    product_variant_fields = product_fields.delete(:product_variants)

    # no point even trying to process these on a create
    product_fields.delete(:delete_variant_ids)
    product_fields.delete(:transitional_delete_variant_ids)

    product = convention.products.create!(product_fields)

    create_or_update_variants(product, product_variant_fields)
    product.product_variants.reload

    { product: product }
  end
end
