# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :page do
    name "MyText"
    slug "MyString"
    content "MyText"
    parent_id 1
    parent_type "MyString"
  end
end
