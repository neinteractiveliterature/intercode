class TicketsController < ApplicationController
  before_action :authenticate_user!
  before_action :check_existing_ticket, only: [:new]

  load_resource through: :user_con_profile, singleton: true
  before_action :check_convention_maximum, only: [:new]
  
  skip_authorization_check

  def show
    redirect_to new_ticket_path unless @ticket
  end

  def new
    if @ticket.ticket_type
      check_publicly_available
    else
      @ticket_types = convention.ticket_types.publicly_available

      if @ticket_types.size == 1
        redirect_to new_ticket_path(ticket: { ticket_type_id: @ticket_types.first.id })
      end
    end
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
    ticket_count = convention.tickets.counts_towards_convention_maximum.count
    return unless ticket_count >= convention.maximum_tickets

    flash[:alert] = "We're sorry, but #{convention.name} is currently sold out."
    redirect_to root_path
  end

  def check_publicly_available
    return if @ticket.ticket_type.publicly_available?

    flash[:alert] = "Sorry, but \"#{@ticket.ticket_type.description}\" \
#{convention.ticket_name.pluralize} are not publicly available.  Please choose a different
#{convention.ticket_name} type or contact #{convention.name} staff."
    redirect_to new_ticket_path
  end
end
