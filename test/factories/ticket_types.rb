# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :ticket_type do
    convention nil
    name "MyText"
    description "MyText"
    pricing_schedule ""
  end
end
