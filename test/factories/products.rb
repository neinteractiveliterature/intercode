# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :product do
    sequence(:name) { |n| "Product #{n}" }
    convention
    payment_options { %w[stripe pay_at_convention] }
    pricing_structure do
      PricingStructure.new(pricing_strategy: 'fixed', value: Money.new(2000, 'USD'))
    end
  end
end
