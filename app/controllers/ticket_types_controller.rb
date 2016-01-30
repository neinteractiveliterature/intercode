class TicketTypesController < BaseControllers::VirtualHost
  load_and_authorize_resource through: :convention

  respond_to :html, :json

  def index
  end

  def new
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
      return redirect_to ticket_types_path, alert: "#{@ticket_type.name} can't be deleted because tickets have been purchased using this ticket type."
    end

    @ticket_type.destroy
    respond_with @ticket_type
  end

  private
  def ticket_type_params
    params.require(:ticket_type).permit(
      :name,
      :description,
      pricing_schedule: {
        timespans: [:start, :finish, value: [:fractional, :currency_code]]
      }
    )
  end
end
