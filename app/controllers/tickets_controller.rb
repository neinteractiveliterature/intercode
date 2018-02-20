class TicketsController < ApplicationController
  before_action :authenticate_user!
  before_action :check_existing_ticket, only: [:new]
  before_action :check_purchase_validity, only: [:new]
  before_action :check_single_ticket_type_available, only: [:new]

  skip_authorization_check

  def show
    redirect_to new_ticket_path unless user_con_profile.ticket
  end

  def new
  end

  private

  def ticket_params
    params.require(:ticket).permit(:ticket_type_id)
  end

  def check_existing_ticket
    redirect_to ticket_path if user_con_profile.ticket
  end

  def check_purchase_validity
    return if new_ticket_service.valid?
    flash[:alert] = new_ticket_service.errors.full_messages.join("\n")

    return redirect_to root_path if new_ticket_service.ticket_type.publicly_available?
    redirect_to new_ticket_path
  end

  def check_single_ticket_type_available
    return if params[:ticket] && params[:ticket][:ticket_type_id]

    ticket_types = convention.ticket_types.publicly_available
    return unless ticket_types.size == 1
    redirect_to new_ticket_path(ticket: { ticket_type_id: ticket_types.first.id })
  end

  def new_ticket_service
    @new_ticket_service ||= PurchaseTicketService.new(
      user_con_profile,
      (
        if params[:ticket] && params[:ticket][:ticket_type_id]
          convention.ticket_types.find(params[:ticket][:ticket_type_id])
        else
          convention.ticket_types.publicly_available.first
        end
      ),
      nil
    )
  end
end
