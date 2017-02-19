# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :user_con_profile do
    user
    convention

    first_name { |profile| profile.user.first_name }
    last_name { |profile| profile.user.last_name }
    nickname "Nick"
  end

  factory :staff_user_con_profile, parent: :user_con_profile do
    staff true
  end
end
