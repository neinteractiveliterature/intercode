class Types::TicketTypeInputType < Types::BaseInputObject

  argument :name, String, required: false
  argument :publicly_available, Boolean, required: false
  argument :maximum_event_provided_tickets, Integer, required: false
  argument :counts_towards_convention_maximum, Boolean, required: false
  argument :allows_event_signups, Boolean, required: false
  argument :description, String, required: false
  argument :pricing_schedule, Types::ScheduledMoneyValueInputType, required: false
end
