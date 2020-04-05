class DeleteTicketService < CivilService::Service
  include SplitTicketOrder

  class Result < CivilService::Result
    attr_accessor :refund_status
  end
  self.result_class = Result

  validate :refund_must_be_possible_if_requested

  attr_reader :ticket, :refund, :whodunit, :operation_name

  def initialize(ticket:, refund:, whodunit:, operation_name: nil)
    @ticket = ticket
    @refund = refund
    @whodunit = whodunit
    @operation_name = operation_name
  end

  private

  def inner_call
    if ticket.order_entry
      if ticket.order_entry.quantity > 1 || ticket.order_entry.order.order_entries.size > 1
        split_ticket_to_new_order(ticket, operation_name || 'ticket deletion')
      end

      # Canceling the order will automatically destroy the ticket
      CancelOrderService.new(
        order: ticket.order_entry.order, whodunit: whodunit, skip_refund: !refund
      ).call!
    else
      ticket.destroy!
      success(refund_status: :not_refunded)
    end
  end

  def convention
    @convention ||= ticket.convention
  end

  def refund_must_be_possible_if_requested
    return unless refund
    return if ticket.order_entry

    errors.add :base, 'Ticket cannot be refunded because there is no associated order'
  end
end
