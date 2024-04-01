# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: orders
#
#  id                      :bigint           not null, primary key
#  paid_at                 :datetime
#  payment_amount_cents    :integer
#  payment_amount_currency :string
#  payment_note            :text
#  status                  :string           not null
#  submitted_at            :datetime
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  charge_id               :string
#  user_con_profile_id     :bigint           not null
#
# Indexes
#
#  index_orders_on_user_con_profile_id  (user_con_profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_con_profile_id => user_con_profiles.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class Order < ApplicationRecord
  belongs_to :user_con_profile
  has_many :order_entries, dependent: :destroy
  validates :status, presence: true, inclusion: { in: Types::OrderStatusType.values.keys }
  has_many :tickets, through: :order_entries
  has_many :coupon_applications, dependent: :destroy
  has_many :coupons, through: :coupon_applications
  has_one :convention, through: :user_con_profile

  scope :pending, -> { where(status: "pending") }
  scope :completed, -> { where(status: %w[unpaid paid]) }

  monetize :payment_amount_cents, with_model_currency: :payment_amount_currency, allow_nil: true

  def total_price_before_discounts
    return Money.new(0, calculated_currency) if order_entries.blank?
    order_entries.sum(Money.new(0, calculated_currency), &:price)
  end

  def total_price
    apps = coupon_applications.includes(:coupon)
    total_after_discounts = apps.inject(total_price_before_discounts) { |price, app| price - app.discount }

    [total_after_discounts, Money.new(0, calculated_currency)].max
  end

  def to_liquid
    OrderDrop.new(self)
  end

  private

  def calculated_currency
    @calculated_currency =
      begin
        entry_currencies = order_entries.map { |entry| entry.price.currency }.uniq
        if entry_currencies.size == 1
          entry_currencies.first
        else
          entry_currencies.first || convention.default_currency_code_or_site_default
        end
      end
  end
end
