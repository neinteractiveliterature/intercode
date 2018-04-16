class Types::ProductType < Types::BaseObject
  field :id, Integer, null: true
  field :product_variants, [Types::ProductVariantType, null: true], null: false

  def product_variants
    AssociationLoader.for(Product, :product_variants).load(@object)
  end
  field :available, Boolean, null: false
  field :name, String, null: false
  field :description, String, null: true
  field :description_html, String, null: true

  def description_html
    return unless @object.description
    @context[:cadmus_renderer].render(@object.description, :html)
  end
  field :image_url, String, null: true

  def image_url
    @object.image&.url
  end
  field :price, Types::MoneyType, null: false

  field :order_quantities_by_status, [Types::OrderQuantityByStatusType, null: true], null: false

  def order_quantities_by_status
    OrderQuantityByStatusLoader.for(Product).load(@object)
  end
end
