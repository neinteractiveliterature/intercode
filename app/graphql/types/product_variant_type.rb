class Types::ProductVariantType < Types::BaseObject
  field :id, Integer, null: true
  field :product, Types::ProductType, null: false

  def product
    AssociationLoader.for(ProductVariant, :product).load(@object)
  end
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
  field :override_price, Types::MoneyType, null: true
  field :position, Integer, null: true

  field :order_quantities_by_status, [Types::OrderQuantityByStatusType, null: true], null: false

  def order_quantities_by_status
    OrderQuantityByStatusLoader.for(ProductVariant).load(@object)
  end
end
