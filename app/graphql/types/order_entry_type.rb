Types::OrderEntryType = GraphQL::ObjectType.define do
  name 'OrderEntry'
  field :id, types.Int
  field :order, !Types::OrderType do
    resolve ->(obj, _args, _ctx) {
      AssociationLoader.for(OrderEntry, :order).load(obj)
    }
  end
  field :product, !Types::ProductType do
    resolve ->(obj, _args, _ctx) {
      AssociationLoader.for(OrderEntry, :product).load(obj)
    }
  end
  field :product_variant, !Types::ProductVariantType do
    resolve ->(obj, _args, _ctx) {
      AssociationLoader.for(OrderEntry, :product_variant).load(obj)
    }
  end
  field :quantity, !types.Int
  field :price_per_item, !Types::MoneyType
  field :price, !Types::MoneyType
  field :describe_products, !types.String
end
