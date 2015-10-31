# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :event do
    convention
    status "accepted"
    category "larp"
  end
end
