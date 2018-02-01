# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :free_ticket_type, class: TicketType do
    convention
    name 'free'
    description 'Free ticket'
    pricing_schedule ScheduledMoneyValue.always(Money.new(0, 'USD'))
  end

  factory :paid_ticket_type, class: TicketType do
    convention
    name 'paid'
    description 'Paid ticket'
    pricing_schedule ScheduledMoneyValue.always(Money.new(2000, 'USD'))
  end

  factory :event_provided_ticket_type, class: TicketType do
    convention
    name 'event_comp'
    description 'Comp ticket for event'
    publicly_available false
    maximum_event_provided_tickets 2
    pricing_schedule ScheduledMoneyValue.always(Money.new(0, 'USD'))
  end
end
