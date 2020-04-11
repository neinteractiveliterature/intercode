class Order < ApplicationRecord
  belongs_to :user_con_profile
  has_many :order_entries, dependent: :destroy
  validates :status, presence: true, inclusion: { in: Types::OrderStatusType.values.keys }
  has_many :tickets, through: :order_entries
  has_many :coupon_applications, dependent: :destroy

  scope :pending, -> { where(status: 'pending') }
  scope :completed, -> { where(status: %w[unpaid paid]) }

  monetize :payment_amount_cents, with_model_currency: :payment_amount_currency, allow_nil: true

  def total_price_before_discounts
    return Money.new(0, 'USD') unless order_entries.present?
    order_entries.sum(&:price)
  end

  def total_price
    price_before_discounts = total_price_before_discounts

    price = price_before_discounts.dup
    coupon_applications.includes(:coupon).find_each do |coupon_application|
      price -= coupon_discount_amount(price_before_discounts, coupon_application.coupon)
    end

    price
  end

  def coupon_discount_amount(price_before_discounts, coupon)
    if coupon.fixed_amount
      coupon.fixed_amount
    elsif coupon.percent_discount
      # always calculate markdown from the grand total so coupon application order doesn't matter
      price_before_discounts * (coupon.percent_discount / 100.0)
    elsif coupon.provides_product_id
      order_entries_for_product = order_entries.select do |entry|
        entry.product_id == coupon.provides_product_id
      end

      order_entries_for_product.map(&:price_per_item).max || Money.new(0, 'USD')
    else
      Money.new(0, 'USD')
    end
  end

  def to_liquid
    OrderDrop.new(self)
  end
end
