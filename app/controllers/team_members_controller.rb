class TeamMembersController < BaseControllers::VirtualHost
  self.responder = NoShowActionResponder

  load_resource :event, through: :convention
  load_and_authorize_resource through: :event
  respond_to :html

  def index
    @team_members = @team_members.joins(:user).includes(:user).order("users.last_name", "users.first_name")
  end

  def new
    @team_member.assign_attributes(
      display: true,
      show_email: true,
      receive_con_email: false,
      receive_signup_email: false
    )
  end

  def create
    @team_member.updated_by = current_user
    @team_member.save
    respond_with @event, @team_member
  end

  def edit
  end

  def update
    @team_member.update_attributes(member_params.merge(updated_by: current_user))
    respond_with @event, @team_member
  end

  def destroy
    @team_member.destroy
    respond_with @event, @team_member
  end

  private

  # Permit access to fields that can be updated
  def team_member_params
    params.require(:team_member).permit(:event_id,
                                        :user_id,
                                        :display,
                                        :show_email,
                                        :receive_con_email,
                                        :receive_signup_email)
  end
end
