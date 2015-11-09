class SignupsController < BaseControllers::VirtualHost
  load_resource :event, through: :convention
  load_resource :run, through: :event
  load_and_authorize_resource

  def index
    @signups_grid = SignupsGrid.new((params[:signups_grid] || {}).merge(run_id: @run.id))
  end
end
