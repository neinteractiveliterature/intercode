class ProvideOrderEntryTicketService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :ticket, :card_error
  end
  self.result_class = Result

  validate :check_existing_ticket
  validate :check_same_convention
  validate :check_convention_is_not_over
  validate :check_convention_maximum

  attr_reader :order_entry
  delegate :product, :order, to: :order_entry
  delegate :user_con_profile, to: :order
  delegate :convention, to: :user_con_profile

  def initialize(order_entry)
    @order_entry = order_entry
  end

  private

  def inner_call
    ticket = create_ticket
    Tickets::PurchasedNotifier.new(ticket: ticket).deliver_now
    success(ticket: ticket)
  end

  def current_price
    @current_price ||= ticket_type.price
  end

  def create_ticket
    user_con_profile.create_ticket!(
      ticket_type: product.provides_ticket_type,
      order_entry: order_entry
    )
  end

  def check_existing_ticket
    return unless user_con_profile.ticket

    errors.add :base, "You already have a ticket for #{convention.name}."
  end

  def check_same_convention
    return if user_con_profile.convention == product.provides_ticket_type.convention

    errors.add :base, 'User profile and ticket type are not from the same convention'
  end

  def check_convention_is_not_over
    return if Time.zone.now < convention.ends_at

    errors.add :base, "#{convention.name} is over and is no longer selling tickets."
  end

  def check_convention_maximum
    return unless convention.maximum_tickets
    ticket_count = convention.tickets.counts_towards_convention_maximum.count
    return unless ticket_count >= convention.maximum_tickets

    errors.add :base, "We're sorry, but #{convention.name} is currently sold out."
  end
end
