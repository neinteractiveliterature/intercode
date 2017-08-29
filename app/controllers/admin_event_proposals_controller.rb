class AdminEventProposalsController < BaseControllers::VirtualHost
  load_resource class: EventProposal, through: :convention, through_association: :event_proposals
  before_action :authorize_admin

  def index
    @admin_event_proposals = @admin_event_proposals.includes(:owner).sort_by do |event_proposal|
      [
        ['proposed', 'reviewing'].include?(event_proposal.status) ? 0 : 1,
        event_proposal.status,
        event_proposal.created_at
      ]
    end
  end

  def show
    @form_items = convention.event_proposal_form.form_items.includes(:form_section).sort_by { |item| [item.form_section.position, item.position ] }
  end

  def update
    if @admin_event_proposal.update(admin_event_proposal_params)
      redirect_to @admin_event_proposal, notice: 'Admin event proposal was successfully updated.'
    else
      render :edit
    end
  end

  private

  def authorize_admin
    permission = params[:action] == 'update' ? :update : :read
    authorize! permission, convention.event_proposals.new
  end

  def admin_event_proposal_params
    params.fetch(:admin_event_proposal, {})
  end
end
