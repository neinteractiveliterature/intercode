class AdminEventProposalsController < ApplicationController
  include Concerns::SendCsv

  load_and_authorize_resource(
    class: EventProposal,
    through: :convention,
    through_association: :event_proposals
  )
  before_action :authorize_admin

  def index
  end

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

  def show
  end

  def update
    if admin_event_proposal_params[:status] == 'accepted' && !@admin_event_proposal.event
      result = AcceptEventProposalService.new(event_proposal: @admin_event_proposal).call

      if result.success?
        flash[:notice] = "Event successfully accepted for #{@convention.name}!"
      else
        flash.now[:alert] = result.errors.join(', ')
        return render :edit
      end
    end

    if @admin_event_proposal.update(admin_event_proposal_params)
      redirect_to [:admin, @admin_event_proposal]
    else
      render :edit
    end
  end

  private

  # Even if the user can manage some event proposals (i.e. their own), only
  # allow access to this controller if they can manage arbitrary ones in this con
  def authorize_admin
    permission = params[:action] == 'update' ? :update : :read
    authorize! permission, EventProposal.new(convention: convention, status: 'reviewing')
  end

  def admin_event_proposal_params
    params.require(:event_proposal).permit(:status)
  end
end
