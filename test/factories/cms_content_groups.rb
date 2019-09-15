# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :cms_content_group do
    sequence(:name) { |n| "content_group_#{n}" }
    association :parent, factory: :convention
  end
end
