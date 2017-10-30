# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :free_ticket_type, class: TicketType do
    convention
    name "free"
    description "Free ticket"
    pricing_schedule ScheduledMoneyValue.always(Money.new(0, 'USD'))
  end

  factory :paid_ticket_type, class: TicketType do
    convention
    name "paid"
    description "Paid ticket"
    pricing_schedule ScheduledMoneyValue.always(Money.new(2000, 'USD'))
  end
end
