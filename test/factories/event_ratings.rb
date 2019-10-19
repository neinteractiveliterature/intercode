FactoryBot.define do
  factory :event_rating do
    event

    after(:build) do |event_rating|
      event_rating.user_con_profile ||= create(:user_con_profile, convention: event_rating.event.convention)
    end
  end
end
