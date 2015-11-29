class UserConProfilesController < BaseControllers::VirtualHost
  load_and_authorize_resource through: :convention

  # GET /user_con_profiles
  def index
    @user_con_profiles_grid = UserConProfilesGrid.new(params[:user_con_profiles_grid] || {order: 'name'}) do |scope|
      scope = scope.where(convention_id: convention.id)
      respond_to do |format|
        format.html { scope.page(params[:page]) }
        format.csv { scope }
      end
    end

    respond_to do |format|
      format.html { }
      format.csv do
        send_data @user_con_profiles_grid.to_csv, filename: "#{@convention.name} - Attendees.csv"
      end
    end
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

  def become
    sign_in @user_con_profile.user
    redirect_to root_url, notice: "You are now signed in as #{@user_con_profile.user.name}."
  end

  private

  # Only allow a trusted parameter "white list" through.
  def user_con_profile_params
    params.require(:user_con_profile).permit(
      :user_email,
      *UserConProfile::PRIV_NAMES
    )
  end
end
