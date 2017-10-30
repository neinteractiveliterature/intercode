class TicketsController < ApplicationController
  before_action :check_existing_ticket, only: [:new, :create]

  load_resource through: :user_con_profile, singleton: true
  before_action :check_convention_maximum, only: [:new, :create]
  before_action :check_publicly_available, only: [:create]
  skip_authorization_check

  respond_to :json, only: [:create]

  def show
    redirect_to new_ticket_path unless @ticket
  end

  def new
    if @ticket.ticket_type
      check_publicly_available
    else
      @ticket_types = convention.ticket_types.publicly_available

      if @ticket_types.size == 1
        redirect_to new_ticket_path(ticket: {ticket_type_id: @ticket_types.first.id})
      end
    end
  end

  def create
    current_price = @ticket.ticket_type.price

    customer = Stripe::Customer.create(
      :email => current_user.email,
      :source  => params[:stripeToken]
    )

    charge = Stripe::Charge.create(
      :customer    => customer.id,
      :amount      => current_price.fractional,
      :description => "#{@ticket.ticket_type.name} for #{convention.name}",
      :currency    => current_price.currency.iso_code.downcase
    )

    @ticket.assign_attributes(
      payment_amount: current_price,
      payment_note: "Paid via Stripe on #{Time.at(charge.created)} (Charge ID #{charge.id})",
      charge_id: charge.id
    )

    @ticket.save
    respond_with @ticket

  rescue Stripe::CardError => e
    @ticket.errors.add(:base, e.message)
    respond_with @ticket
  end

  private
  def ticket_params
    params.require(:ticket).permit(:ticket_type_id)
  end

  def check_existing_ticket
    redirect_to ticket_path if user_con_profile.ticket
  end

  def check_convention_maximum
    return unless convention.maximum_tickets

    if convention.tickets.counts_towards_convention_maximum.count >= convention.maximum_tickets
      flash[:alert] = "We're sorry, but #{convention.name} is currently sold out."
      redirect_to root_path
    end
  end

  def check_publicly_available
    unless @ticket.ticket_type.publicly_available?
      flash[:alert] = "Sorry, but \"#{@ticket.ticket_type.description}\" tickets are not publicly available.  Please choose a different ticket type or contact #{convention.name} staff."
      redirect_to new_ticket_path
    end
  end
end
