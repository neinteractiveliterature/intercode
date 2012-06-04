# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :virtual_host do
    con nil
    domain "MyString"
  end
end
