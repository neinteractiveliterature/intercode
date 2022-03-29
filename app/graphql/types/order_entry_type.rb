# frozen_string_literal: true
class Types::OrderEntryType < Types::BaseObject
  field :id, ID, null: false
  field :order, Types::OrderType, null: false
  field :product, Types::ProductType, null: false
  field :product_variant, Types::ProductVariantType, null: true
  field :quantity, Integer, null: false
  field :price_per_item, Types::MoneyType, null: false
  field :price, Types::MoneyType, null: false
  field :describe_products, String, null: false
  field :run, Types::RunType, null: true

  association_loaders OrderEntry, :order, :product, :product_variant, :run
end
