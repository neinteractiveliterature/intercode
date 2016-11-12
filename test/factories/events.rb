# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :event do
    convention

    sequence(:title) { |n| "Event #{n}" }
    status "accepted"
    category "larp"
    registration_policy RegistrationPolicy.unlimited
  end
end
