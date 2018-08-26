class AdminSignupsController < ApplicationController
  include Concerns::SendCsv

  load_resource :event, through: :convention
  load_resource :run, through: :event
  load_and_authorize_resource class: Signup

  def index
  end

  def export
    respond_to do |format|
      format.csv do
        title_suffix = if @run.title_suffix.present?
          " (#{@run.title_suffix})"
        else
          ''
        end

        send_table_presenter_csv(
          Tables::SignupsTableResultsPresenter.for_run(
            @run,
            params[:filters]&.to_unsafe_h,
            params[:sort],
            params[:columns]
          ),
          "#{@run.event.title}#{title_suffix} Signups"
        )
      end
    end
  end
end
