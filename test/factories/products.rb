# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :product do
    sequence(:name) { |n| "Product #{n}" }
    convention
    payment_options { %w[stripe pay_at_convention] }
  end
end
