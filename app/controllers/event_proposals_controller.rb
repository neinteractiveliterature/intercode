class EventProposalsController < ApplicationController
  include Concerns::FormResponseController

  load_and_authorize_resource through: :convention
  before_action :ensure_no_event_yet, only: [:edit]
  respond_to :html, :json

  def index
    redirect_to page_url('new-proposal')
  end

  def edit
  end

  def destroy
    @event_proposal.destroy
    redirect_to root_url, notice: 'Your event proposal has been deleted.'
  end

  private

  def ensure_no_event_yet
    redirect_to "/events/#{@event_proposal.event.to_param}/edit" if @event_proposal.event
  end
end
