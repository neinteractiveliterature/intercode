class TeamMembersController < ApplicationController
  load_resource :event, through: :convention
  load_and_authorize_resource through: :event

  def index
    @team_members = @team_members.joins(:user).includes(:user).order("users.last_name", "users.first_name")
  end

  def new
  end

  def edit
  end
end
