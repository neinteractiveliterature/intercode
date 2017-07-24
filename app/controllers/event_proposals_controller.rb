class EventProposalsController < BaseControllers::VirtualHost
  load_and_authorize_resource through: :convention
  respond_to :html, :json

  def create
    @event_proposal.owner = current_user
    @event_proposal.save

    respond_with @event_proposal do |format|
      format.html { redirect_to [:edit, @event_proposal] }
    end
  end

  def edit
  end

  def update
    @event_proposal.save
    respond_with @event_proposal
  end

  private

  def event_proposal_params
    params.require(:event_proposal).permit()
  end
end
