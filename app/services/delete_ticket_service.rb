class DeleteTicketService < CivilService::Service
  include SplitTicketOrder

  class Result < CivilService::Result
    attr_accessor :refund_status
  end
  self.result_class = Result

  attr_reader :ticket, :refund, :whodunit

  def initialize(ticket:, refund:, whodunit:)
    @ticket = ticket
    @refund = refund
    @whodunit = whodunit
  end

  private

  def inner_call
    refund_status = :not_refunded

    if refund && !ticket.order_entry
      raise 'Ticket cannot be refunded because there is no associated order'
    end

    if ticket.order_entry
      if ticket.order_entry.quantity > 1 || ticket.order_entry.order.order_entries.size > 1
        split_ticket_to_new_order(ticket, 'ticket deletion')
      end

      # Canceling the order will automatically destroy the ticket
      CancelOrderService.new(
        order: ticket.order_entry.order, whodunit: whodunit, skip_refund: !refund
      ).call!
    else
      ticket.destroy!
    end

    success(refund_status: refund_status)
  end

  def convention
    @convention ||= ticket.convention
  end
end
