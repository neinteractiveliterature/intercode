class TicketTypesController < BaseControllers::VirtualHost
  load_and_authorize_resource through: :convention

  respond_to :html, :json

  def index
  end
end
