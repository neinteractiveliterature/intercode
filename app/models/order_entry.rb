class OrderEntry < ApplicationRecord
  belongs_to :order
  belongs_to :product
  belongs_to :product_variant, optional: true

  monetize :price_per_item_cents, with_model_currency: :price_per_item_currency, allow_nil: true

  def price
    price_per_item * quantity
  end
end
