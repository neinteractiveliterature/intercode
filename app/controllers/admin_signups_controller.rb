class AdminSignupsController < ApplicationController
  include Concerns::SendCsv

  load_resource :event, through: :convention
  load_resource :run, through: :event
  load_and_authorize_resource class: Signup

  def index
    grid_params = params.to_unsafe_hash[:admin_signups_grid] || { order: 'id' }
    @signups_grid = AdminSignupsGrid.new(grid_params) do |scope|
      scope.where(run_id: @run.id)
    end

    respond_to do |format|
      format.html {}
      format.csv do
        filename = [@event.title, @run.title_suffix.presence, 'Signups'].compact.join(' - ')
        filename << '.csv'

        send_data @signups_grid.to_csv, filename: filename
      end
    end
  end

  def export
    respond_to do |format|
      format.csv do
        table = Tables::SignupsTableResultsPresenter.for_run(
          @run,
          params[:filters]&.to_unsafe_h,
          params[:sort],
          params[:columns]
        )
        filter_descriptions = table.filter_descriptions
        name_suffix = if filter_descriptions.any?
          " (#{filter_descriptions.map { |desc| desc.gsub(':', ' -') }.join(', ')})"
        else
          ''
        end

        title_suffix = if @run.title_suffix.present?
          " (#{@run.title_suffix})"
        else
          ''
        end

        configure_csv_headers("#{@run.event.title}#{title_suffix} Signups#{name_suffix}.csv")
        self.response_body = table.csv_enumerator
      end
    end
  end
end
