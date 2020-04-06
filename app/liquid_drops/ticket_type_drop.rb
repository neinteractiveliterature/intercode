# A type of ticket that this convention issues
class TicketTypeDrop < Liquid::Drop
  include DeprecatedTicketApiCompat

  # @api
  attr_reader :ticket_type

  # @!method id
  #   @return [Integer] The numeric database ID of this ticket type
  # @!method name
  #   @return [String] The unique string name of this ticket type
  # @!method description
  #   @return [String] The human-readable description of this ticket type
  # @!method maximum_event_provided_tickets
  #   @return [Integer] The default number of tickets of this type events are allowed to provide
  # @!method providing_products
  #   @return [Array<ProductDrop>] Products that provide this type of ticket
  delegate :id, :name, :description, :next_price_change,
    :maximum_event_provided_tickets, :allows_event_signups, :providing_products, to: :ticket_type

  # @api
  def initialize(ticket_type)
    @ticket_type = ticket_type
  end

  # @return [ScheduledValueDrop] The pricing schedule for this ticket type
  # @deprecated Tickets are now provided through products
  def pricing_schedule
    pricing_schedule = pricing_schedule_for_ticket_type(ticket_type)
    ScheduledValueDrop.new(pricing_schedule, ticket_type.convention.timezone)
  end

  # @return [Boolean] Whether this ticket type is publicly available for purchase
  # @deprecated Tickets are now provided through products
  def publicly_available
    ticket_type_publicly_available?(ticket_type)
  end

  # @return [String] The current price of this ticket type
  # @deprecated Tickets are now provided through products.  Please use the pricing_structure object
  #   in the ticket type's providing product to get this information.
  def price
    pricing_schedule = pricing_schedule_for_ticket_type(ticket_type)
    pricing_schedule.value_at(Time.zone.now)&.format
  end

  # @return [String] The price this ticket type will next change to, if there is an upcoming change
  # @deprecated Tickets are now provided through products.  Please use the pricing_structure object
  #   in the ticket type's providing product to get this information.
  def next_price
    next_change = next_price_change
    return unless next_change

    pricing_schedule = pricing_schedule_for_ticket_type(ticket_type)
    pricing_schedule&.value_at(next_change)&.format
  end

  # @return [ActiveSupport::Time] When the price of this ticket type will next change, if there is
  #                                 an upcoming price change
  # @deprecated Tickets are now provided through products.  Please use the pricing_structure object
  #   in the ticket type's providing product to get this information.
  def next_price_change
    pricing_schedule = pricing_schedule_for_ticket_type(ticket_type)
    pricing_schedule&.next_value_change_after(Time.zone.now)&.in_time_zone(
      ticket_type.convention.timezone
    )
  end
end
