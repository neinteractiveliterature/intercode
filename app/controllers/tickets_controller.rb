class TicketsController < BaseControllers::VirtualHost
  load_and_authorize_resource through: :user_con_profile, singleton: true

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
      :email => params[:stripeEmail],
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
    flash[:alert] = e.message
    redirect_to new_ticket_path
  end

  private
  def ticket_params
    params.require(:ticket).permit(:ticket_type_id)
  end

  def pricing_schedule
    @pricing_schedule ||= @ticket.ticket_type.pricing_schedule
  end
  helper_method :pricing_schedule

  def current_price
    @current_price ||= pricing_schedule.value_at(Time.now)
  end
  helper_method :current_price
end
