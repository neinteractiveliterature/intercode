class Mutations::UpdateProduct < Mutations::BaseMutation
  field :product, Types::ProductType, null: false

  argument :id, Integer, required: true
  argument :product, Types::ProductInputType, required: true

  load_and_authorize_convention_associated_model :products, :id, :update

  attr_reader :product

  define_authorization_check do |args|
    @product = convention.products.includes(:product_variants).find(args[:id])
    policy(product).update?
  end

  def resolve(**args)
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
  end
end
