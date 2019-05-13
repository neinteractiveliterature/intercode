class AdminEventProposalsController < ApplicationController
  include Concerns::SendCsv

  before_action :authorize_admin

  def export
    respond_to do |format|
      format.csv do
        send_table_presenter_csv(
          Tables::EventProposalsTableResultsPresenter.for_convention(
            convention,
            current_ability,
            params[:filters]&.to_unsafe_h,
            params[:sort],
            params[:columns]
          ),
          "Event proposals - #{convention.name}"
        )
      end
    end
  end

  private

  # Even if the user can manage some event proposals (i.e. their own), only
  # allow access to this controller if they can manage arbitrary ones in this con
  def authorize_admin
    authorize! :view_event_proposals, convention
  end
end
