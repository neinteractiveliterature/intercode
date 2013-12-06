# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :page do
    name "MyText"
    slug "MyString"
    content "MyText"
    association :parent, factory: :convention
  end
end
