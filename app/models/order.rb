class Order < ApplicationRecord
  belongs_to :user_con_profile
  has_many :order_entries, dependent: :destroy
  validates :status, presence: true, inclusion: { in: Types::OrderStatusType.values.keys }
  has_many :tickets, through: :order_entries

  scope :pending, -> { where(status: 'pending') }
  scope :completed, -> { where(status: %w[unpaid paid]) }

  monetize :payment_amount_cents, with_model_currency: :payment_amount_currency, allow_nil: true

  def total_price
    return Money.new(0, 'USD') unless order_entries.any?
    order_entries.sum(&:price)
  end

  def to_liquid
    OrderDrop.new(self)
  end
end
