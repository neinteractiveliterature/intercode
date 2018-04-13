Types::ProductType = GraphQL::ObjectType.define do
  name 'Product'
  field :id, types.Int
  field :product_variants, !types[Types::ProductVariantType] do
    resolve ->(obj, _args, _ctx) {
      AssociationLoader.for(Product, :product_variants).load(obj)
    }
  end
  field :available, !types.Boolean
  field :name, !types.String
  field :description, types.String
  field :description_html, types.String do
    resolve -> (obj, _args, ctx) {
      return unless obj.description
      ctx[:cadmus_renderer].render(obj.description, :html)
    }
  end
  field :image_url, types.String do
    resolve -> (obj, _args, _ctx) {
      obj.image&.url
    }
  end
  field :price, !Types::MoneyType

  field :order_quantities_by_status, !types[Types::OrderQuantityByStatusType] do
    resolve -> (obj, _args, _ctx) {
      OrderQuantityByStatusLoader.for(Product).load(obj)
    }
  end
end
