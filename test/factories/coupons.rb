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
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
FactoryBot.define do
  factory :coupon do
    convention
    fixed_amount { Money.new(1000, "USD") }
  end
end
