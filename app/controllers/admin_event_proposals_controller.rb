class AdminEventProposalsController < ApplicationController
  load_and_authorize_resource class: EventProposal, through: :convention, through_association: :event_proposals
  before_action :authorize_admin

  helper :form_response

  def index
    @admin_event_proposals = @admin_event_proposals.where.not(status: 'draft').includes(:owner).sort_by do |event_proposal|
      [
        ['proposed', 'reviewing'].include?(event_proposal.status) ? 0 : 1,
        event_proposal.status,
        event_proposal.created_at
      ]
    end
  end

  def show
    @form_items = convention.event_proposal_form.form_items.includes(:form_section).sort_by { |item| [item.form_section.position, item.position] }
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
    permission = params[:action] == 'update' ? :manage : :read
    authorize! permission, convention.event_proposals.new(status: 'proposed')
  end

  def admin_event_proposal_params
    params.require(:event_proposal).permit(:status)
  end
end
