Types::ProductVariantType = GraphQL::ObjectType.define do
  name 'ProductVariant'
  field :id, types.Int
  field :product, !Types::ProductType do
    resolve ->(obj, _args, _ctx) {
      AssociationLoader.for(ProductVariant, :product).load(obj)
    }
  end
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
  field :override_price, Types::MoneyType
  field :position, types.Int

  field :order_quantities_by_status, !types[Types::OrderQuantityByStatusType] do
    resolve -> (obj, _args, _ctx) {
      OrderQuantityByStatusLoader.for(ProductVariant).load(obj)
    }
  end
end
