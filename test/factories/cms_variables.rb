# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :cms_variable do
    sequence(:key) { |n| "variable_#{n}" }
    value { 'foobar' }
    association :parent, factory: :convention
  end
end
