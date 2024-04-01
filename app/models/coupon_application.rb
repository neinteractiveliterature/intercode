# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: coupon_applications
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  coupon_id  :bigint           not null
#  order_id   :bigint           not null
#
# Indexes
#
#  index_coupon_applications_on_coupon_id  (coupon_id)
#  index_coupon_applications_on_order_id   (order_id)
#
# Foreign Keys
#
#  fk_rails_...  (coupon_id => coupons.id)
#  fk_rails_...  (order_id => orders.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class CouponApplication < ApplicationRecord
  belongs_to :coupon
  belongs_to :order

  scope :active, -> { where(order: Order.completed) }
  validates :coupon_id, uniqueness: { scope: :order_id, message: "has already been applied to this order" }

  def discount
    if coupon.fixed_amount
      coupon.fixed_amount
    elsif coupon.percent_discount
      # always calculate markdown from the grand total so coupon application order doesn't matter
      order.total_price_before_discounts * (coupon.percent_discount / 100.0)
    elsif coupon.provides_product_id
      order_entries_for_product = order.order_entries.select { |entry| entry.product_id == coupon.provides_product_id }

      # take the most expensive instance of a product in the order
      order_entries_for_product.map(&:price_per_item).max ||
        Money.new(0, coupon.convention.default_currency_code_or_site_default)
    else
      Money.new(0, coupon.convention.default_currency_code_or_site_default)
    end
  end
end
