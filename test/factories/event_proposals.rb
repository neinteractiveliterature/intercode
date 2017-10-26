# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :event_proposal do
    sequence(:title) { |n| "Event proposal #{n}" }
    status 'proposed'
    convention
  end
end
