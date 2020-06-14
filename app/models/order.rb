class Order < ApplicationRecord
  belongs_to :user_con_profile
  has_many :order_entries, dependent: :destroy
  validates :status, presence: true, inclusion: { in: Types::OrderStatusType.values.keys }
  has_many :tickets, through: :order_entries
  has_many :coupon_applications, dependent: :destroy
  has_many :coupons, through: :coupon_applications

  scope :pending, -> { where(status: 'pending') }
  scope :completed, -> { where(status: %w[unpaid paid]) }

  monetize :payment_amount_cents, with_model_currency: :payment_amount_currency, allow_nil: true

  def total_price_before_discounts
    return Money.new(0, 'USD') unless order_entries.present?
    order_entries.sum(&:price)
  end

  def total_price
    apps = coupon_applications.includes(:coupon)
    total_after_discounts = apps.inject(total_price_before_discounts) do |price, app|
      price - app.discount
    end

    [total_after_discounts, Money.new(0, 'USD')].max
  end

  def to_liquid
    OrderDrop.new(self)
  end
end
