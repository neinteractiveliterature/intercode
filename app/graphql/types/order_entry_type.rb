class Types::OrderEntryType < Types::BaseObject
  field :id, Integer, null: true
  field :order, Types::OrderType, null: false

  def order
    AssociationLoader.for(OrderEntry, :order).load(@object)
  end
  field :product, Types::ProductType, null: false

  def product
    AssociationLoader.for(OrderEntry, :product).load(@object)
  end
  field :product_variant, Types::ProductVariantType, null: false

  def product_variant
    AssociationLoader.for(OrderEntry, :product_variant).load(@object)
  end
  field :quantity, Integer, null: false
  field :price_per_item, Types::MoneyType, null: false
  field :price, Types::MoneyType, null: false
  field :describe_products, String, null: false
end
