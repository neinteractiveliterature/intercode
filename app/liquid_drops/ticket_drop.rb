class TicketDrop < Liquid::Drop
  attr_reader :ticket
  delegate :id, :user_con_profile, :provided_by_event, :payment_amount, to: :ticket
  delegate :name, :description, to: :ticket_type, prefix: true

  def initialize(ticket)
    @ticket = ticket
  end

  private

  # We want to delegate name and description to the ticket type, but not expose the ticket type itself to Liquid templates
  def ticket_type
    ticket.ticket_type
  end
end
