# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :product_variant do
    sequence(:name) { |n| "Variant #{n}" }
    product
  end
end
