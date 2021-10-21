# frozen_string_literal: true
class Types::ProductVariantType < Types::BaseObject
  field :transitional_id,
        ID,
        deprecation_reason:
          "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
        null: false,
        method: :id,
        camelize: true
  field :id, ID, null: false
  field :product, Types::ProductType, null: false

  association_loaders ProductVariant, :product

  field :name, String, null: false
  field :description, String, null: true
  field :description_html, String, null: true

  def description_html
    return unless object.description
    context[:cadmus_renderer].render(object.description, :html)
  end

  field :image_url, String, null: true

  def image_url
    object.image&.url
  end

  field :override_price, Types::MoneyType, null: true, deprecation_reason: 'Use override_pricing_structure instead'
  field :override_pricing_structure, Types::PricingStructureType, null: true
  field :position, Integer, null: true

  field :order_quantities_by_status, [Types::OrderQuantityByStatusType], null: false

  def order_quantities_by_status
    OrderQuantityByStatusLoader.for(ProductVariant).load(object)
  end

  def override_price
    object.override_pricing_structure&.price
  end
end
