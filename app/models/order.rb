class Order < ApplicationRecord
  STATUSES = %w[paid unpaid cancelled]

  belongs_to :user_con_profile
  has_many :order_entries
  validates :status, inclusion: { in: STATUSES }

  monetize :payment_amount_cents, with_model_currency: :payment_amount_currency, allow_nil: true

  def total_price
    order_entries.sum(&:price)
  end
end
