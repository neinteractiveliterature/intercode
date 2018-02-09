class TicketTypesController < ApplicationController
  load_and_authorize_resource through: :convention

  respond_to :html, :json

  def index
    @ticket_types = @ticket_types.sort_by do |ticket_type|
      [
        ticket_type.publicly_available? ? 0 : 1,
        ticket_type.event_provided? ? 0 : 1,
        ticket_type.name
      ]
    end
  end

  def new
    @ticket_type.name ||= ''
    @ticket_type.description ||= ''
  end

  def update
    @ticket_type.update(ticket_type_params)
    respond_with @ticket_type
  end

  def create
    @ticket_type.save
    respond_with @ticket_type
  end

  def destroy
    if @ticket_type.tickets.any?
      return redirect_to ticket_types_path, alert: "#{@ticket_type.name} can't be deleted because \
#{convention.ticket_name.pluralize} have been purchased using this #{convention.ticket_name} type."
    end

    @ticket_type.destroy
    respond_with @ticket_type
  end

  private

  def ticket_type_params
    params.require(:ticket_type).permit(
      :name,
      :description,
      :publicly_available,
      :maximum_event_provided_tickets,
      pricing_schedule: {
        timespans: [:start, :finish, value: [:fractional, :currency_code]]
      }
    )
  end
end
