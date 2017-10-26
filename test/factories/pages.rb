# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :page do
    sequence(:name) { |n| "Page #{n}" }
    content "MyText"
    association :parent, factory: :convention
  end
end
