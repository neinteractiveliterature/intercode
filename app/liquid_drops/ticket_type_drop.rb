# A type of ticket that this convention issues
class TicketTypeDrop < Liquid::Drop
  # @api
  attr_reader :ticket_type

  # @!method id
  #   @return [Integer] The numeric database ID of this ticket type
  # @!method name
  #   @return [String] The unique string name of this ticket type
  # @!method description
  #   @return [String] The human-readable description of this ticket type
  # @!method next_price_change
  #   @return [ActiveSupport::Time] When the price of this ticket type will next change, if there is
  #                                 an upcoming price change
  # @!method publicly_available
  #   @return [Boolean] Whether this ticket type is publicly available for purchase
  # @!method maximum_event_provided_tickets
  #   @return [Integer] The default number of tickets of this type events are allowed to provide
  delegate :id, :name, :description, :next_price_change,
    :publicly_available, :maximum_event_provided_tickets, :allows_event_signups, to: :ticket_type

  # @api
  def initialize(ticket_type)
    @ticket_type = ticket_type
  end

  # @return [ScheduledValueDrop] The pricing schedule for this ticket type
  def pricing_schedule
    ScheduledValueDrop.new(ticket_type.pricing_schedule, ticket_type.convention.timezone)
  end

  # @return [String] The current price of this ticket type
  def price
    ticket_type.price&.format
  end

  # @return [String] The price this ticket type will next change to, if there is an upcoming change
  def next_price
    ticket_type.next_price&.format
  end
end
