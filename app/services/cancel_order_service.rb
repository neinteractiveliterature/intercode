# frozen_string_literal: true
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

  def inner_call # rubocop:disable Metrics/AbcSize
    refund, refund_status = refund_order

    action = "Cancelled #{order.status == "paid" ? " (#{refund_status.to_s.humanize.downcase})" : "unpaid"}"

    order.update!(
      status: "cancelled",
      payment_note: [
        "#{action} by #{whodunit.name}
on #{Time.now.in_time_zone(convention.timezone).strftime("%B %-d, %Y at %l:%M%P")}",
        order.payment_note.presence
      ].compact.join("; ")
    )
    order.order_entries.each { |entry| entry.tickets.destroy_all }
    Orders::CancelledNotifier.new(order: order, refund_id: refund&.id, triggering_user: whodunit).deliver_later

    success(refund_status: refund_status)
  end

  def refund_order
    return nil, :not_refunded if skip_refund || order.charge_id.blank?

    charge = Stripe::Charge.retrieve(order.charge_id, stripe_account: convention.stripe_account_id)

    if charge.refunded
      [charge.refunds.first, :already_refunded]
    else
      refund =
        Stripe::Refund.create(
          { charge: order.charge_id, amount: order.payment_amount.fractional },
          stripe_account: convention.stripe_account_id
        )
      [refund, :refunded]
    end
  end

  def order_must_not_already_be_cancelled
    return unless order.status == "cancelled"

    errors.add(:order, "is already cancelled")
  end

  def convention
    @convention ||= order.user_con_profile.convention
  end
end
