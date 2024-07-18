# frozen_string_literal: true
class SubmitOrderService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :card_error
  end
  self.result_class = Result

  def self.statement_descriptor_suffix(convention)
    convention.name.gsub(/[^0-9A-Za-z \-]/, "").slice(0, 22)
  end

  validate :ensure_not_buying_duplicate_ticket
  validate :ensure_only_one_ticket
  validate :ensure_coupons_usable
  validate :ensure_free_order_is_actually_free
  validate :check_ticket_provider_validity

  attr_reader :order, :payment_mode, :payment_intent_id
  delegate :user_con_profile, to: :order
  delegate :convention, to: :user_con_profile

  def initialize(order, payment_mode:, payment_intent_id: nil)
    @order = order
    @payment_mode = payment_mode
    @payment_intent_id = payment_intent_id
  end

  private

  def inner_call
    case payment_mode
    when "now", "payment_intent"
      update_order_from_payment_intent
    when "free"
      order.update!(status: "paid", submitted_at: Time.zone.now)
    else
      order.update!(status: "unpaid", submitted_at: Time.zone.now)
    end

    ticket_providers.each(&:call!)
    success
  end

  def update_order_from_payment_intent
    pi =
      Stripe::PaymentIntent.retrieve(
        { id: payment_intent_id, expand: ["latest_charge"] },
        { stripe_account: convention.stripe_account_id }
      )
    if pi.status == "succeeded"
      charge = pi.latest_charge
      order.update!(
        status: "paid",
        payment_amount: order.total_price,
        payment_note:
          "Paid via Stripe on #{Time.at(charge.created).in_time_zone(convention.timezone)} (Charge ID #{charge.id})",
        charge_id: charge.id,
        paid_at: Time.zone.at(charge.created),
        submitted_at: Time.zone.now
      )
      Orders::PurchasedNotifier.new(order:).deliver_now
    else
      order.update!(status: "unpaid", submitted_at: Time.zone.now)
    end
  end

  def ticket_providing_order_entries
    @ticket_providing_order_entries ||= order.order_entries.select { |entry| entry.product.provides_ticket_type }
  end

  def ensure_not_buying_duplicate_ticket
    return unless ticket_providing_order_entries.any? && user_con_profile.ticket
    errors.add :base, "You already have a #{convention.ticket_name} for #{convention.name}"
  end

  def ensure_only_one_ticket
    ticket_quantity = ticket_providing_order_entries.sum(&:quantity)
    return unless ticket_quantity > 1
    errors.add :base, "You can’t buy more than one #{convention.ticket_name}"
  end

  def ensure_coupons_usable
    order.coupons.each do |coupon|
      errors.add :base, "Coupon #{coupon.code} is expired" if coupon.expired?
      errors.add :base, "Coupon #{coupon.code} has been used up already" if coupon.usage_limit_reached?
    end
  end

  def ensure_free_order_is_actually_free
    return unless payment_mode == "free" && order.total_price.cents != 0
    errors.add :base, "Cannot use free payment mode on an order that costs money"
  end

  def ticket_providers
    return [] if payment_mode == "unpaid"

    @ticket_providers ||=
      order.order_entries.flat_map do |order_entry|
        if order_entry.product.provides_ticket_type
          [ProvideOrderEntryTicketService.new(order_entry, suppress_notifications: (payment_mode == "now"))]
        else
          []
        end
      end
  end

  def check_ticket_provider_validity
    ticket_providers.each do |provider|
      next if provider.valid?
      errors.merge!(provider.errors)
    end
  end
end
