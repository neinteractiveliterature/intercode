class UsersController < ApplicationController
  before_filter :authenticate_user!

  def index
    authorize_action_for ApplicationAuthorizer
    @users = User.all
  end

  def show
    authorize_action_for ApplicationAuthorizer
    @user = User.find(params[:id])
  end

  def edit
    authorize_action_for ApplicationAuthorizer
    @user = User.find(params[:id])
  end

  def update
    authorize_action_for ApplicationAuthorizer

    @user = User.find(params[:id])

    if @user.update(user_params)
      redirect_to users_path, :flash => { :success => 'Convention updated!' }
    else
      render 'edit'
    end

  end

  private
  def user_params
    params.require(:user).permit(:first_name, :last_name, :email, :nickname, :phone, :default_gender)
  end

end