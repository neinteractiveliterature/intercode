# frozen_string_literal: true
class PayOrderService < CivilService::Service
  def self.statement_descriptor_suffix(convention)
    convention.name.gsub(/[^0-9A-Za-z \-]/, '').slice(0, 22)
  end

  class Result < CivilService::Result
    attr_accessor :card_error
  end
  self.result_class = Result

  validate :check_order_status

  attr_reader :order, :stripe_token

  def initialize(order, stripe_token)
    @order = order
    @stripe_token = stripe_token
  end

  private

  def inner_call
    charge =
      begin
        create_charge
      rescue Stripe::CardError => e
        errors.add :base, e.message
        return failure(errors, card_error: true)
      end

    update_order(charge)
    Orders::PurchasedNotifier.new(order: order).deliver_now

    success
  end

  def create_charge
    customer =
      Stripe::Customer.create(
        { email: order.user_con_profile.email, source: stripe_token },
        stripe_account: convention.stripe_account_id
      )

    Stripe::Charge.create(
      {
        customer: customer.id,
        amount: order.total_price.fractional,
        description: "#{description} for #{convention.name}",
        statement_descriptor_suffix: PayOrderService.statement_descriptor_suffix(convention),
        currency: order.total_price.currency.iso_code.downcase
      },
      stripe_account: convention.stripe_account_id
    )
  end

  def update_order(charge)
    order.update!(
      status: 'paid',
      payment_amount: order.total_price,
      payment_note:
        "Paid via Stripe on \
#{Time.at(charge.created).in_time_zone(convention.timezone)} (Charge ID #{charge.id})",
      charge_id: charge.id,
      paid_at: Time.zone.at(charge.created)
    )
  end

  def description
    @description ||= order.order_entries.map(&:describe_products).to_sentence
  end

  def convention
    @convention ||= order.user_con_profile.convention
  end

  def check_order_status
    return if order.status == 'pending' || order.status == 'unpaid'

    errors.add(:base, "This order is already #{order.status}.")
  end
end
