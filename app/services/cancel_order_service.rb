class CancelOrderService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :refund_status
  end
  self.result_class = Result

  validate :order_must_not_already_be_cancelled

  attr_reader :order, :whodunit, :skip_refund

  def initialize(order:, whodunit:, skip_refund: false)
    @order = order
    @whodunit = whodunit
    @skip_refund = skip_refund
  end

  private

  def inner_call
    refund, refund_status = refund_order

    action = 'Cancelled '
    if order.status == 'paid'
      action << " (#{refund_status.to_s.humanize.downcase})"
    else
      action << 'unpaid'
    end

    order.update!(
      status: 'cancelled',
      payment_note: [
        "#{action} by #{whodunit.name_without_nickname} \
on #{Time.now.in_time_zone(convention.timezone).strftime('%B %-d, %Y at %l:%M%P')}",
        order.payment_note.presence
      ].compact.join('; ')
    )
    order.order_entries.each { |entry| entry.tickets.destroy_all }
    Orders::CancelledNotifier.new(order: order, refund_id: refund&.id).deliver_later

    success(refund_status: refund_status)
  end

  def refund_order
    return [nil, :not_refunded] unless order.charge_id

    charge = Stripe::Charge.retrieve(order.charge_id, api_key: convention.stripe_secret_key)

    if charge.refunded
      [charge.refunds.first, :already_refunded]
    else
      refund = Stripe::Refund.create(
        {
          charge: order.charge_id,
          amount: order.payment_amount.fractional
        },
        api_key: convention.stripe_secret_key
      )
      [refund, :refunded]
    end
  end

  def order_must_not_already_be_cancelled
    return unless order.status == 'cancelled'

    errors.add(:order, 'is already cancelled')
  end

  def convention
    @convention ||= order.user_con_profile.convention
  end
end
