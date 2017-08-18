class EventProposalsController < BaseControllers::VirtualHost
  load_and_authorize_resource through: :convention
  respond_to :html, :json

  def index
  end

  def create
    @event_proposal.assign_attributes(owner: user_con_profile, status: 'draft')
    @event_proposal.save

    respond_with @event_proposal do |format|
      format.html do
        if @event_proposal.valid?
          redirect_to [:edit, @event_proposal]
        else
          redirect_to new_event_proposal_url, alert: @event_proposal.errors.full_messages.join(', ')
        end
      end
    end
  end

  def show
    respond_with @event_proposal do |format|
      format.json do
        presenter = FormResponsePresenter.new(convention.event_proposal_form, @event_proposal)
        render json: presenter.as_json
      end
    end
  end

  def edit
  end

  def update
    @event_proposal.assign_form_response_attributes(params[:form_response])
    @event_proposal.save

    respond_with @event_proposal
  end

  private

  def event_proposal_params
    (params[:event_proposal] || ActionController::Parameters.new).permit()
  end
end
