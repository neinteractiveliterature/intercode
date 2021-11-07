# frozen_string_literal: true
class Types::OrderEntryType < Types::BaseObject
  field :transitional_id,
        ID,
        deprecation_reason:
          "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
        null: false,
        method: :id,
        camelize: true
  field :id, ID, null: false
  field :order, Types::OrderType, null: false
  field :product, Types::ProductType, null: false
  field :product_variant, Types::ProductVariantType, null: true
  field :quantity, Integer, null: false
  field :price_per_item, Types::MoneyType, null: false
  field :price, Types::MoneyType, null: false
  field :describe_products, String, null: false

  association_loaders OrderEntry, :order, :product, :product_variant
end
