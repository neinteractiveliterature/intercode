# frozen_string_literal: true
class Types::OrderEntryType < Types::BaseObject
  field :id,
        Integer,
        deprecation_reason:
          'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
        null: false
  field :transitional_id, ID, method: :id, null: false, camelize: true
  field :order, Types::OrderType, null: false
  field :product, Types::ProductType, null: false
  field :product_variant, Types::ProductVariantType, null: true
  field :quantity, Integer, null: false
  field :price_per_item, Types::MoneyType, null: false
  field :price, Types::MoneyType, null: false
  field :describe_products, String, null: false

  association_loaders OrderEntry, :order, :product, :product_variant
end
