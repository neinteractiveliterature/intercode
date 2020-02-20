class PurchaseTicketService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :ticket, :card_error
  end
  self.result_class = Result

  validate :check_existing_ticket
  validate :check_same_convention
  validate :check_convention_is_not_over
  validate :check_convention_maximum
  validate :check_publicly_available

  attr_reader :user_con_profile, :ticket_type, :stripe_token
  delegate :convention, to: :user_con_profile

  def initialize(user_con_profile, ticket_type, stripe_token)
    @user_con_profile = user_con_profile
    @ticket_type = ticket_type
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

    ticket = create_ticket(charge)
    Tickets::PurchasedNotifier.new(ticket: ticket).deliver_now
    success(ticket: ticket)
  end

  def current_price
    @current_price ||= ticket_type.price
  end

  def create_charge
    customer = Stripe::Customer.create(
      {
        email: user_con_profile.email,
        source: stripe_token
      },
      api_key: convention.stripe_secret_key
    )

    Stripe::Charge.create(
      {
        customer: customer.id,
        amount: current_price.fractional,
        description: "#{ticket_type.description} for #{convention.name}",
        currency: current_price.currency.iso_code.downcase
      },
      api_key: convention.stripe_secret_key
    )
  end

  def create_ticket(charge)
    user_con_profile.create_ticket!(
      ticket_type: ticket_type,
      payment_amount: current_price,
      payment_note: "Paid via Stripe on \
#{Time.at(charge.created).in_time_zone(convention.timezone)} (Charge ID #{charge.id})",
      charge_id: charge.id
    )
  end

  def check_existing_ticket
    return unless user_con_profile.ticket

    errors.add :base, "You already have a ticket for #{convention.name}."
  end

  def check_same_convention
    return if user_con_profile.convention == ticket_type.convention

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

  def check_publicly_available
    return if ticket_type.publicly_available?

    errors.add :base, "Sorry, but \"#{ticket_type.description}\" \
#{convention.ticket_name.pluralize} are not publicly available.  Please choose a different
#{convention.ticket_name} type or contact #{convention.name} staff."
  end
end
