# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :event do
    convention

    sequence(:title) { |n| "Event #{n}" }
    status 'active'
    category 'larp'
    registration_policy RegistrationPolicy.unlimited
    length_seconds 4.hours
    con_mail_destination 'event_email'

    factory :filler_event do
      category 'filler'

      after(:build) { |filler_event| filler_event.runs << FactoryBot.build(:run, event: filler_event) }
    end
  end
end
