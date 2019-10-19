FactoryBot.define do
  factory :user do
    sequence(:first_name) { |n| "Firstname#{n}" }
    last_name { 'Lastname' }

    sequence(:email) { |n| "user#{n}@example.com" }
    password { 'password' }

    factory :site_admin do
      site_admin { true }
    end
  end
end
