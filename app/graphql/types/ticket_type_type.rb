class Types::TicketTypeType < Types::BaseObject
  include DeprecatedTicketApiCompat

  field :id, Integer, null: false
  field :name, String, null: true
  field :counts_towards_convention_maximum, Boolean, null: false
  field :allows_event_signups, Boolean, null: false
  field :description, String, null: true
  field :convention, Types::ConventionType, null: false
  field :providing_products, [Types::ProductType], null: false

  association_loaders TicketType, :convention, :providing_products

  field :maximum_event_provided_tickets, Integer, null: false do
    argument :event_id, Integer, required: false, camelize: false
  end

  def maximum_event_provided_tickets(**args)
    if args[:event_id]
      object.maximum_event_provided_tickets_for_event_id(args[:event_id])
    else
      object.maximum_event_provided_tickets
    end
  end

  field :publicly_available, Boolean,
    null: false, deprecation_reason: 'Tickets are now provided through products'
  def publicly_available
    ticket_type_publicly_available?(object)
  end

  field :pricing_schedule, Types::ScheduledMoneyValueType,
    null: false, deprecation_reason: 'Tickets are now provided through products'
  def pricing_schedule
    pricing_schedule_for_ticket_type(object)
  end
end
