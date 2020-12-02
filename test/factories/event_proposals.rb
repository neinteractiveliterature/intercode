# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :event_proposal do
    sequence(:title) { |n| "Event proposal #{n}" }
    status { 'proposed' }
    convention
    length_seconds { 1.hour.to_i }

    after(:build) do |event_proposal|
      event_proposal.event_category ||= create(
        :event_category, convention: event_proposal.convention
      )
      event_proposal.owner ||= create(:user_con_profile, convention: event_proposal.convention)
    end
  end
end
