class TicketTypeDrop < Liquid::Drop
  attr_reader :ticket_type
  delegate :name, :description, :price_change, :next_price_change, to: :ticket_type

  def initialize(ticket_type)
    @ticket_type = ticket_type
  end

  def pricing_schedule
    ScheduledValueDrop.new(ticket_type.pricing_schedule)
  end

  def price
    ticket_type.price&.format
  end

  def next_price
    ticket_type.next_price&.format
  end
end