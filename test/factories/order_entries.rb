FactoryBot.define do
  factory :order_entry do
    association :order
    association :product
    quantity { 1 }
  end
end
