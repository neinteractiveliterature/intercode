# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :event do
    convention

    sequence(:title) { |n| "Event #{n}" }
    status "active"
    category "larp"
    registration_policy RegistrationPolicy.unlimited
    length_seconds 4.hours
  end
end
