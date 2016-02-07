class MyProfilesController < BaseControllers::VirtualHost
  before_action :ensure_user_con_profile, except: [:new, :create]
  before_action :build_user_con_profile, only: [:new, :create]
  authorize_resource :user_con_profile

  def show
  end

  private
  def ensure_user_con_profile
    redirect_to new_my_profile_path unless user_con_profile
  end
end
