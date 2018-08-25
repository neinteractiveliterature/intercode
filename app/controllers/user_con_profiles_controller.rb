class UserConProfilesController < ApplicationController
  include Concerns::SendCsv

  # Normally we'd just use the name of the resource as the instance variable name.  Here that'd be
  # @user_con_profile, which is unsafe for us to use because ApplicationController uses it to mean
  # the current user, and we use that for authorization checking.  So instead, we'll call the user
  # con profile we're working on the "subject profile" (as in the subject of our actions).
  load_and_authorize_resource :subject_profile,
    id_param: :id,
    parent: false,
    class: 'UserConProfile',
    through: :convention,
    through_association: :user_con_profiles
  before_action :authorize_admin_profiles

  # GET /user_con_profiles
  def index
    @page_title = 'Attendees'
  end

  # GET /user_con_profiles/1
  def show
    @page_title = @subject_profile.name
  end

  # GET /user_con_profiles/1/edit
  def edit
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

  def export
    respond_to do |format|
      format.csv do
        send_table_presenter_csv(
          Tables::UserConProfilesTableResultsPresenter.for_convention(
            convention,
            current_ability,
            params[:filters]&.to_unsafe_h,
            params[:sort],
            params[:columns]
          ),
          "#{convention.name} Attendees"
        )
      end
    end
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

  # Only allow people who can update arbitrary user con profiles for this convention to access this
  # controller. In other words, users shouldn't be able to access even their own profile here
  # (because they could use this controller to escalate their privileges).
  def authorize_admin_profiles
    authorize! :view_attendees, convention
  end
end
