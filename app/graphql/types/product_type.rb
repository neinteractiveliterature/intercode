class Types::ProductType < Types::BaseObject
  field :id, Integer, null: true
  field :product_variants, [Types::ProductVariantType], null: false
  field :available, Boolean, null: false
  field :name, String, null: false
  field :description, String, null: true
  field :description_html, String, null: true

  association_loaders Product, :product_variants

  def description_html
    return unless object.description
    context[:cadmus_renderer].render(object.description, :html)
  end

  field :image_url, String, null: true

  def image_url
    object.image&.url
  end

  field :price, Types::MoneyType, null: false
  field :payment_options, [String, null: true], null: false
  field :order_quantities_by_status, [Types::OrderQuantityByStatusType], null: false

  def order_quantities_by_status
    OrderQuantityByStatusLoader.for(Product).load(object)
  end
end
