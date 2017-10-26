# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :team_member do
    event

    after(:build) do |team_member|
      team_member.user_con_profile ||= FactoryBot.build(:user_con_profile, convention: team_member.event.convention)
    end
  end
end
