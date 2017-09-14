class AdminEventsController < BaseControllers::VirtualHost
  before_action :authorize_admin

  def index
  end

  private

  # Even if the user can manage some events (i.e. their own), only
  # allow access to this controller if they can manage arbitrary ones in this con
  def authorize_admin
    authorize! :update, convention.events.new
  end
end
