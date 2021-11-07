# frozen_string_literal: true
class Mutations::UpdateProduct < Mutations::BaseMutation
  include ProductMutationHelper

  field :product, Types::ProductType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :product, Types::ProductInputType, required: true

  load_and_authorize_convention_associated_model :products, :id, :update

  attr_reader :product

  define_authorization_check do |args|
    @product = convention.products.includes(:product_variants).find(args[:transitional_id] || args[:id])
    policy(product).update?
  end

  def resolve(**args)
    product_fields =
      process_transitional_ids_in_input(args[:product].to_h, :delete_variant_ids, :provides_ticket_type_id)
        .deep_symbolize_keys
    product_fields[:pricing_structure] = coerce_pricing_structure_input(product_fields[:pricing_structure])

    create_or_update_variants(product, product_fields.delete(:product_variants))

    (product_fields.delete(:delete_variant_ids) || []).each do |variant_id|
      product.product_variants.find { |v| v.id == variant_id }.destroy!
    end
    product.product_variants.reload

    product.update!(product_fields)

    { product: product }
  end
end
