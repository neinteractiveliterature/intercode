class CouponApplication < ApplicationRecord
  belongs_to :coupon
  belongs_to :order

  scope :active, -> { where(order: Order.completed) }
end
