FactoryBot.define do
  factory :user do
    sequence(:first_name) { |n| "Firstname#{n}" }
    last_name 'Lastname'

    sequence(:email) { |n| "user#{n}@example.com" }
    password 'password'
  end
end
