class AdminTicketsController < ApplicationController
  load_resource :ticket_user_con_profile, class: UserConProfile, id_param: :user_con_profile_id
  before_action :check_existing_ticket, only: [:new, :create]
  load_and_authorize_resource :ticket, parent: false, through: :ticket_user_con_profile, singleton: true, except: [:new, :create]

  respond_to :html, :json

  def new
    @ticket = @ticket_user_con_profile.build_ticket
    authorize! :create, @ticket
  end

  def create
    @ticket = @ticket_user_con_profile.build_ticket(ticket_params)
    authorize! :create, @ticket
    @ticket.save
    respond_with @ticket, location: @ticket_user_con_profile
  end

  def edit
  end

  def update
    @ticket.update(ticket_params)
    respond_with @ticket, location: @ticket_user_con_profile
  end

  def destroy
    @ticket.destroy
    respond_with @ticket, location: @ticket_user_con_profile
  end

  private
  def check_existing_ticket
    redirect_to edit_user_con_profile_admin_ticket_path(@ticket_user_con_profile) if @ticket_user_con_profile.ticket
  end

  def ticket_params
    params.require(:ticket).permit(
      :ticket_type_id,
      :payment_amount,
      :provided_by_event_id,
      :payment_note
    )
  end
end
