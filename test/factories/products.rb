# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: products
#
#  id                      :bigint           not null, primary key
#  available               :boolean
#  clickwrap_agreement     :text
#  description             :text
#  image                   :string
#  name                    :text
#  payment_options         :jsonb
#  pricing_structure       :jsonb            not null
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  convention_id           :bigint
#  provides_ticket_type_id :bigint
#
# Indexes
#
#  index_products_on_convention_id            (convention_id)
#  index_products_on_provides_ticket_type_id  (provides_ticket_type_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#  fk_rails_...  (provides_ticket_type_id => ticket_types.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

FactoryBot.define do
  factory :product do
    sequence(:name) { |n| "Product #{n}" }
    convention
    payment_options { %w[stripe pay_at_convention] }
    pricing_structure { PricingStructure.new(pricing_strategy: 'fixed', value: Money.new(2000, 'USD')) }
  end
end
