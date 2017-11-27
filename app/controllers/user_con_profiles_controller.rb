class UserConProfilesController < ApplicationController
  # Normally we'd just use the name of the resource as the instance variable name.  Here that'd be @user_con_profile,
  # which is unsafe for us to use because ApplicationController uses it to mean the current user, and we use
  # that for authorization checking.  So instead, we'll call the user con profile we're working on the "subject
  # profile" (as in the subject of our actions).
  load_and_authorize_resource :subject_profile, id_param: :id, parent: false, class: "UserConProfile",
    through: :convention, through_association: :user_con_profiles
  before_action :authorize_admin_profiles

  # GET /user_con_profiles
  def index
    @user_con_profiles_grid = UserConProfilesGrid.new(params[:user_con_profiles_grid]&.permit! || {order: 'name'}) do |scope|
      scope = scope.accessible_by(current_ability).where(convention_id: convention.id)
      respond_to do |format|
        format.html { scope.paginate(page: params[:page], per_page: params[:per_page]) }
        format.json { scope.paginate(page: params[:page], per_page: params[:per_page]) }
        format.csv { scope }
      end
    end

    convention.user_con_profile_form.form_items.each do |form_item|
      next unless form_item.identifier
      next if %w(first_name last_name).include?(form_item.identifier)

      @user_con_profiles_grid.column(form_item.identifier) do |user_con_profile|
        user_con_profile.read_form_response_attribute(form_item.identifier)
      end
    end

    respond_to do |format|
      format.html { }
      format.csv do
        send_data @user_con_profiles_grid.to_csv, filename: "#{@convention.name} - Attendees.csv"
      end
      format.json do
        render json: {
          user_con_profiles: @user_con_profiles_grid.assets,
          page_info: {
            current_page: @user_con_profiles_grid.scope.current_page,
            next_page: @user_con_profiles_grid.scope.next_page,
            per_page: @user_con_profiles_grid.scope.per_page,
            total_entries: @user_con_profiles_grid.scope.total_entries,
            total_pages: @user_con_profiles_grid.scope.total_pages,
          }
        }
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
    if @subject_profile.save
      redirect_to @subject_profile, notice: 'Profile was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /user_con_profiles/1
  def update
    if @subject_profile.update(subject_profile_params)
      redirect_to @subject_profile, notice: 'Profile was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /user_con_profiles/1
  def destroy
    @subject_profile.destroy
    redirect_to user_con_profiles_url, notice: 'Profile was successfully destroyed.'
  end

  def become
    sign_in @subject_profile.user
    redirect_to root_url, notice: "You are now signed in as #{@subject_profile.user.name}."
  end

  private

  # Only allow a trusted parameter "white list" through.
  def subject_profile_params
    params.require(:subject_profile).permit(
      :email,
      :first_name,
      :last_name,
      *UserConProfile::PRIV_NAMES
    )
  end

  # Only allow people who can update arbitrary user con profiles for this convention to access this controller.
  # In other words, users shouldn't be able to access even their own profile here (because they could use this
  # controller to escalate their privileges).
  def authorize_admin_profiles
    authorize! :update, convention.user_con_profiles.new
  end
end
