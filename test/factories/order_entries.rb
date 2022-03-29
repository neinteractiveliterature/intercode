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
FactoryBot.define do
  factory :order_entry do
    association :order
    association :product
    quantity { 1 }
  end
end
