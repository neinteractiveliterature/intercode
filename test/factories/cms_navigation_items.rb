# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :cms_navigation_item do
    sequence(:title) { |n| "navigation item #{n}" }
    association :parent, factory: :convention
  end
end
