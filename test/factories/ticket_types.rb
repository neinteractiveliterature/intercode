# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: ticket_types
#
#  id                                :bigint           not null, primary key
#  allows_event_signups              :boolean          default(TRUE), not null
#  counts_towards_convention_maximum :boolean          default(TRUE), not null
#  description                       :text
#  maximum_event_provided_tickets    :integer          default(0), not null
#  name                              :text             not null
#  created_at                        :datetime         not null
#  updated_at                        :datetime         not null
#  convention_id                     :bigint
#  event_id                          :bigint
#
# Indexes
#
#  index_ticket_types_on_convention_id  (convention_id)
#  index_ticket_types_on_event_id       (event_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#  fk_rails_...  (event_id => events.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
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
      ticket_type.providing_products <<
        build(
          :product,
          convention: ticket_type.convention,
          provides_ticket_type: ticket_type,
          pricing_structure: PricingStructure.new(pricing_strategy: 'fixed', value: Money.new(2000, 'USD'))
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
