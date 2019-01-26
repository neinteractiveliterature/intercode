class DeleteTicketService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :refund_status
  end
  self.result_class = Result

  attr_reader :ticket, :refund

  def initialize(ticket:, refund:)
    @ticket = ticket
    @refund = refund
  end

  private

  def inner_call
    refund_status = :not_refunded

    if refund
      raise 'Ticket cannot be refunded because there is no Stripe charge ID' unless ticket.charge_id
      charge = Stripe::Charge.retrieve(ticket.charge_id, api_key: convention.stripe_secret_key)
      if charge.refunded
        refund_status = :already_refunded
      else
        Stripe::Refund.create({ charge: ticket.charge_id }, api_key: convention.stripe_secret_key)
        refund_status = :refunded
      end
    end

    ticket.destroy!

    success(refund_status: refund_status)
  end

  def convention
    @convention ||= ticket.convention
  end
end
