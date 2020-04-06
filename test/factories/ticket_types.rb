# Read about factories at https://github.com/thoughtbot/factory_bot

FactoryBot.define do
  factory :free_ticket_type, class: TicketType do
    convention
    name { 'free' }
    description { 'Free ticket' }
  end

  factory :paid_ticket_type, class: TicketType do
    convention
    name { 'paid' }
    description { 'Paid ticket' }

    after(:build) do |ticket_type|
      ticket_type.providing_products << build(
        :product,
        convention: ticket_type.convention,
        provides_ticket_type: ticket_type,
        pricing_structure: PricingStructure.new(
          pricing_strategy: 'fixed',
          value: Money.new(2000, 'USD')
        )
      )
    end
  end

  factory :event_provided_ticket_type, class: TicketType do
    convention
    name { 'event_comp' }
    description { 'Comp ticket for event' }
    maximum_event_provided_tickets { 2 }
  end
end
