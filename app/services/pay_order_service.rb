class PayOrderService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :card_error
  end
  self.result_class = Result

  validate :check_order_status
  validate :check_ticket_provider_validity

  attr_reader :order, :stripe_token

  def initialize(order, stripe_token)
    @order = order
    @stripe_token = stripe_token
  end

  private

  def inner_call
    charge = begin
      create_charge
    rescue Stripe::CardError => e
      errors.add :base, e.message
      return failure(errors, card_error: true)
    end

    update_order(charge)
    Orders::PurchasedNotifier.new(order: order).deliver_now

    provide_tickets

    success
  end

  def create_charge
    customer = Stripe::Customer.create(
      {
        email: order.user_con_profile.email,
        source: stripe_token
      },
      api_key: convention.stripe_secret_key
    )

    Stripe::Charge.create(
      {
        customer: customer.id,
        amount: order.total_price.fractional,
        description: "#{description} for #{convention.name}",
        currency: order.total_price.currency.iso_code.downcase
      },
      api_key: convention.stripe_secret_key
    )
  end

  def update_order(charge)
    order.update!(
      status: 'paid',
      payment_amount: order.total_price,
      payment_note: "Paid via Stripe on \
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

  def ticket_providers
    @ticket_providers ||= order.order_entries.flat_map do |order_entry|
      if order_entry.product.provides_ticket_type
        [ProvideOrderEntryTicketService.new(order_entry)]
      else
        []
      end
    end
  end

  def check_order_status
    return if order.status == 'pending' || order.status == 'unpaid'

    errors.add(:base, "This order is already #{order.status}.")
  end

  def check_ticket_provider_validity
    ticket_providers.each do |provider|
      next if provider.valid?
      errors.merge!(provider.errors)
    end
  end
end
