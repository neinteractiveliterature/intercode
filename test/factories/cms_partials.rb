# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :cms_partial do
    identifier "a_partial"
    content "Some text"
    convention
  end
end
