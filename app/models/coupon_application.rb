class CouponApplication < ApplicationRecord
  belongs_to :coupon
  belongs_to :order

  scope :active, -> { where(order: Order.completed) }
  validates :coupon_id, uniqueness: {
    scope: :order_id, message: 'has already been applied to this order'
  }

  def discount
    if coupon.fixed_amount
      coupon.fixed_amount
    elsif coupon.percent_discount
      # always calculate markdown from the grand total so coupon application order doesn't matter
      order.total_price_before_discounts * (coupon.percent_discount / 100.0)
    elsif coupon.provides_product_id
      order_entries_for_product = order.order_entries.select do |entry|
        entry.product_id == coupon.provides_product_id
      end

      # take the most expensive instance of a product in the order
      order_entries_for_product.map(&:price_per_item).max || Money.new(0, 'USD')
    else
      Money.new(0, 'USD')
    end
  end
end
