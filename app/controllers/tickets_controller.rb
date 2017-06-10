class TicketsController < BaseControllers::VirtualHost
  before_action :check_existing_ticket, only: [:new, :create]
  load_resource through: :user_con_profile, singleton: true
  skip_authorization_check

  respond_to :html, :json

  def show
    redirect_to new_ticket_path unless @ticket
  end

  def new
    unless @ticket.ticket_type
      @ticket_types = convention.ticket_types

      if @ticket_types.size == 1
        redirect_to new_ticket_path(ticket: {ticket_type_id: @ticket_types.first.id})
      end
    end
  end

  def create
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
    responsd_with @ticket
  end

  private
  def ticket_params
    params.require(:ticket).permit(:ticket_type_id)
  end

  def check_existing_ticket
    redirect_to ticket_path if user_con_profile.ticket
  end
end
