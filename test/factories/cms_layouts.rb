# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :cms_layout do
    sequence(:name) { |n| "layout_#{n}" }
    content { 'Some text' }
    association :parent, factory: :convention
  end
end
