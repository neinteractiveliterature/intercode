# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: coupons
#
#  id                    :bigint           not null, primary key
#  code                  :text             not null
#  expires_at            :datetime
#  fixed_amount_cents    :integer
#  fixed_amount_currency :string
#  percent_discount      :decimal(, )
#  usage_limit           :integer
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  convention_id         :bigint           not null
#  provides_product_id   :bigint
#
# Indexes
#
#  coupon_codes_unique_per_convention_idx   (convention_id, lower(code)) UNIQUE
#  index_coupons_on_convention_id           (convention_id)
#  index_coupons_on_convention_id_and_code  (convention_id,code) UNIQUE
#  index_coupons_on_provides_product_id     (provides_product_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#  fk_rails_...  (provides_product_id => products.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class Coupon < ApplicationRecord
  belongs_to :convention
  belongs_to :provides_product, class_name: 'Product', optional: true
  has_many :coupon_applications, dependent: :destroy

  monetize :fixed_amount_cents, with_model_currency: :fixed_amount_currency, allow_nil: true

  validates :code, presence: true, uniqueness: { scope: :convention_id }
  validates :percent_discount, numericality: { allow_nil: true, greater_than: 0, less_than_or_equal_to: 100 }
  validate :ensure_convention_matches_provided_product
  validate :ensure_exactly_one_discount_model

  before_validation { self.code = Devise.friendly_token if code.blank? }

  def expired?
    return false unless expires_at
    expires_at <= Time.zone.now
  end

  def usage_limit_reached?
    return false unless usage_limit
    usage_limit <= coupon_applications.active.count
  end

  private

  def ensure_convention_matches_provided_product
    return unless convention && provides_product
    return if convention == provides_product.convention

    errors.add :provides_product,
               "must be a product in #{convention.name} \
(but is instead in #{provides_product.convention.name})"
  end

  def ensure_exactly_one_discount_model
    discount_models =
      %w[fixed_amount provides_product percent_discount].index_with { |field| public_send(field) }.compact

    return if discount_models.size == 1

    if discount_models.empty?
      errors.add :base, 'Must have either a fixed discount amount, a percentage discount, or a provided product'
    else
      errors.add :base,
                 "Must have only one discount type, but has \
#{discount_models.keys.map(&:humanize).to_sentence}"
    end
  end
end
