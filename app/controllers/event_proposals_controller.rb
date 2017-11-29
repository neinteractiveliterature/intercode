class EventProposalsController < ApplicationController
  include Concerns::FormResponseController

  load_and_authorize_resource through: :convention
  before_action :ensure_accepting_proposals, only: [:create]
  respond_to :html, :json

  def index
    redirect_to page_url('new-proposal')
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
    send_form_response(convention.event_proposal_form, @event_proposal)
  end

  def edit
  end

  def update
    update_form_response(@event_proposal)
  end

  def submit
    if @event_proposal.status == 'draft'
      @event_proposal.update!(status: 'proposed')
      EventProposalsMailer.new_proposal(@event_proposal).deliver_later
    else
      EventProposalsMailer.proposal_updated(@event_proposal).deliver_later
    end

    respond_with @event_proposal
  end

  private

  def event_proposal_params
    (params[:event_proposal] || ActionController::Parameters.new).permit()
  end

  def ensure_accepting_proposals
    unless convention.accepting_proposals
      redirect_to root_path, alert: "#{convention.name} is not currently accepting event proposals."
    end
  end
end
