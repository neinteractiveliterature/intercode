class MyProfilesController < BaseControllers::VirtualHost
  before_action :ensure_user_con_profile, except: [:new, :create]
  before_action :build_user_con_profile, only: [:new, :create]
  authorize_resource :user_con_profile

  respond_to :html

  def show
  end

  def edit
  end

  def update
    @user_con_profile.update(user_con_profile_params)
    respond_with @user_con_profile, location: my_profile_path
  end

  def new
  end

  def create
    @user_con_profile.save
    respond_with @user_con_profile, location: my_profile_path
  end

  private
  def ensure_user_con_profile
    unless user_con_profile
      if user_signed_in?
        redirect_to new_my_profile_path
      else
        session[:register_via_convention_id] = convention.id
        redirect_to new_user_registration_url(host: Rails.application.config.action_mailer.default_url_options[:host])
      end
    end
  end

  def build_user_con_profile
    @user_con_profile = current_user.user_con_profiles.build(
      default_user_con_profile_params.merge(user_con_profile_params).merge(convention_id: convention.id)
    )
  end

  def user_con_profile_params
    params[:user_con_profile].try!(:permit, *user_con_profile_param_names) || {}
  end

  def default_user_con_profile_params
    user_params = {
      first_name: current_user.first_name,
      last_name: current_user.last_name
    }

    most_recent_profile = current_user.user_con_profiles.order(:created_at).last
    if most_recent_profile
      user_params.merge(most_recent_profile.attributes.slice(*user_con_profile_param_names))
    else
      user_params
    end
  end

  def user_con_profile_param_names
    [:first_name, :last_name, :nickname]
  end
end
