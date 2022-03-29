# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: order_entries
#
#  id                      :bigint           not null, primary key
#  price_per_item_cents    :integer
#  price_per_item_currency :string
#  quantity                :integer
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  order_id                :bigint           not null
#  product_id              :bigint           not null
#  product_variant_id      :bigint
#  run_id                  :bigint
#
# Indexes
#
#  index_order_entries_on_order_id            (order_id)
#  index_order_entries_on_product_id          (product_id)
#  index_order_entries_on_product_variant_id  (product_variant_id)
#  index_order_entries_on_run_id              (run_id)
#
# Foreign Keys
#
#  fk_rails_...  (order_id => orders.id)
#  fk_rails_...  (product_id => products.id)
#  fk_rails_...  (product_variant_id => product_variants.id)
#  fk_rails_...  (run_id => runs.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class OrderEntry < ApplicationRecord
  belongs_to :order
  belongs_to :product
  belongs_to :product_variant, optional: true
  belongs_to :run, optional: true
  has_many :tickets, dependent: :nullify

  monetize :price_per_item_cents, with_model_currency: :price_per_item_currency, allow_nil: true

  validates :order, presence: true
  validates :product, presence: true
  validates :quantity, numericality: { greater_than_or_equal_to: 1 }
  validates :product_variant_id, uniqueness: { scope: %i[order_id product_id] }
  validate :product_variant_must_belong_to_product

  before_create do |order_entry|
    if order_entry.price_per_item.blank?
      price_args = { time: order_entry.order&.paid_at || Time.zone.now }

      order_entry.price_per_item =
        if order_entry.product_variant
          (
            order_entry.product_variant.override_pricing_structure&.price(**price_args) ||
              order_entry.product.pricing_structure.price(**price_args)
          )
        else
          order_entry.product.pricing_structure.price(**price_args)
        end
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
