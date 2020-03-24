class OrderEntry < ApplicationRecord
  belongs_to :order
  belongs_to :product
  belongs_to :product_variant, optional: true

  monetize :price_per_item_cents, with_model_currency: :price_per_item_currency, allow_nil: true

  validates :order, presence: true
  validates :product, presence: true
  validates :quantity, numericality: { greater_than_or_equal_to: 1 }
  validates :product_variant_id, uniqueness: { scope: [:order_id, :product_id] }
  validate :product_variant_must_belong_to_product

  before_save do |order_entry|
    price_args = { time: Time.zone.now }

    if order_entry.product_variant
      order_entry.price_per_item = (
        order_entry.product_variant.override_pricing_structure.price(**price_args) ||
        order_entry.product.pricing_structure.price(**price_args)
      )
    else
      order_entry.price_per_item = order_entry.product.pricing_structure.price(**price_args)
    end
  end

  def price
    price_per_item * quantity
  end

  def describe_products(always_show_quantity: false)
    [
      always_show_quantity || quantity > 1 ? quantity.to_s : nil,
      quantity > 1 ? product.name.pluralize : product.name,
      product_variant ? "(#{product_variant.name})" : nil
    ].compact.join(' ')
  end

  def to_liquid
    OrderEntryDrop.new(self)
  end

  private

  def product_variant_must_belong_to_product
    return unless product_variant && product
    return if product_variant.product == product

    errors.add(:base, 'Product variant and product are mismatched')
  end
end
