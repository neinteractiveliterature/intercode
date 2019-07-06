FactoryBot.define do
  factory :maximum_event_provided_tickets_override do
    association :event
    override_value { 42 }

    after(:build) do |mepto|
      mepto.ticket_type ||= build(
        :event_provided_ticket_type, convention: mepto.event.convention
      )
    end
  end
end
