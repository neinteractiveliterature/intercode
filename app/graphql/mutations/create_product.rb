# frozen_string_literal: true
class Mutations::CreateProduct < Mutations::BaseMutation
  include ProductMutationHelper

  field :product, Types::ProductType, null: false

  argument :product, Types::ProductInputType, required: true

  define_authorization_check do |args|
    convention = context[:convention]
    product = convention.products.new(provides_ticket_type_id: args[:product][:provides_ticket_type_id])
    policy(product).create?
  end

  def resolve(**args)
    product_fields = args[:product].to_h.deep_symbolize_keys
    product_fields[:pricing_structure] = coerce_pricing_structure_input(product_fields[:pricing_structure])
    product_variant_fields = product_fields.delete(:product_variants)

    # no point even trying to process these on a create
    product_fields.delete(:delete_variant_ids)

    product = convention.products.create!(product_fields)

    create_or_update_variants(product, product_variant_fields)
    product.product_variants.reload

    { product: product }
  end
end
