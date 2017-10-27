class AdminSignupsController < ApplicationController
  load_resource :event, through: :convention
  load_resource :run, through: :event
  load_and_authorize_resource class: Signup

  def index
    @signups_grid = AdminSignupsGrid.new(params.to_unsafe_hash[:admin_signups_grid] || {order: 'id'}) do |scope|
      scope.where(run_id: @run.id)
    end

    respond_to do |format|
      format.html {}
      format.csv do
        filename = [@event.title, @run.title_suffix.presence, "Signups"].compact.join(" - ")
        filename << ".csv"

        send_data @signups_grid.to_csv, filename: filename
      end
    end
  end
end
