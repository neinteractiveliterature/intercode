# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :event do
    convention

    sequence(:title) { |n| "Event #{n}" }
    status { 'active' }
    registration_policy { RegistrationPolicy.unlimited }
    length_seconds { 4.hours }
    con_mail_destination { 'event_email' }

    after(:build) do |event|
      event.event_category ||= build(:event_category, convention: event.convention)
    end
  end
end
