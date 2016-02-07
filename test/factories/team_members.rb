# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :team_member do
    event

    after(:build) do |team_member|
      team_member.user_con_profile ||= FactoryGirl.build(:user_con_profile, convention: team_member.event.convention)
    end
  end
end
