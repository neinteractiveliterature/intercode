class AdminTicketsController < BaseControllers::VirtualHost
  load_resource :user_con_profile
  before_action :check_existing_ticket, only: [:new, :create]
  load_and_authorize_resource :ticket, parent: false, through: :user_con_profile, singleton: true

  respond_to :html, :json

  def new
  end

  def create
    @ticket.save
    respond_with @ticket, location: @user_con_profile
  end

  def edit
  end

  def update
    @ticket.update(ticket_params)
    respond_with @ticket, location: @user_con_profile
  end

  def destroy
    @ticket.destroy
    respond_with @ticket, location: @user_con_profile
  end

  private
  def check_existing_ticket
    redirect_to ticket_path if @user_con_profile.ticket
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