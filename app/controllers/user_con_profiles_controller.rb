class UserConProfilesController < BaseControllers::VirtualHost
  load_and_authorize_resource through: :convention

  # GET /user_con_profiles
  def index
    @user_con_profiles = @user_con_profiles.joins(:user).includes(:user).order("users.last_name", "users.first_name")
  end

  # GET /user_con_profiles/1
  def show
  end

  # GET /user_con_profiles/new
  def new
  end

  # GET /user_con_profiles/1/edit
  def edit
  end

  # POST /user_con_profiles
  def create
    if @user_con_profile.save
      redirect_to @user_con_profile, notice: 'User con profile was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /user_con_profiles/1
  def update
    if @user_con_profile.update(user_con_profile_params)
      redirect_to @user_con_profile, notice: 'User con profile was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /user_con_profiles/1
  def destroy
    @user_con_profile.destroy
    redirect_to user_con_profiles_url, notice: 'User con profile was successfully destroyed.'
  end

  private
  
  # Only allow a trusted parameter "white list" through.
  def user_con_profile_params
    params.require(:user_con_profile).permit(
      :user_email, 
      :registration_status, 
      :payment_amount_cents, 
      :payment_note, 
      :comp_event_id, 
      *UserConProfile::PRIV_NAMES
    )
  end
end
