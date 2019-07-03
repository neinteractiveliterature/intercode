# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :room do
    association(:convention)
    name { 'MyString' }
  end
end
