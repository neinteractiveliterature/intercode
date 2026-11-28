# frozen_string_literal: true
class Types::OrderEntryType < Types::BaseObject
  description "One line of an order: a quantity of a product"
  field :describe_products, String, null: false, description: "A human-readable summary of what this entry is for"
  field :id, ID, null: false, description: "The ID of this order entry"
  field :order, Types::OrderType, null: false, description: "The order containing this entry"
  field :price, Types::MoneyType, null: false, description: "The total price of this entry"
  field :price_per_item, Types::MoneyType, null: false, description: "The price of each item in this entry"
  field :product, Types::ProductType, null: false, description: "The product being ordered"
  field :product_variant,
        Types::ProductVariantType,
        null: true,
        description: "The variant of the product, if it has variants"
  field :quantity, Integer, null: false, description: "The number of items ordered"
  field :run, Types::RunType, null: true, description: "The run this entry is for, if it is for a particular run"

  association_loaders OrderEntry, :order, :product, :product_variant, :run
end
