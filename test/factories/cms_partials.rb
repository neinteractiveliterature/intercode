# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :cms_partial do
    sequence(:name) { |n| "partial_#{n}" }
    content "Some text"
    association :parent, factory: :convention
  end
end
