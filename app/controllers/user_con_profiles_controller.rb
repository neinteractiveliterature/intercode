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
  before_action :authorize_admin_profiles, except: [:revert_become]

  unless Rails.env.test?
    skip_before_action :verify_authenticity_token, only: [:become, :revert_become]
  end

  def index
    @page_title = 'Attendees'
  end

  def become
    identity_assumer = assumed_identity_from_profile || user_con_profile
    sign_in @subject_profile.user
    session[:assumed_identity_from_profile_id] = identity_assumer.id
    redirect_to root_url, notice: "You are now signed in as #{@subject_profile.user.name}."
  end

  def revert_become
    unless assumed_identity_from_profile
      return redirect_to(root_url, alert: "You haven't assumed an identity, so you can't revert \
back to your normal identity (since you already are your normal identity).")
    end

    regular_user_con_profile = assumed_identity_from_profile
    sign_in regular_user_con_profile.user
    session.delete(:assumed_identity_from_profile_id)
    redirect_to root_url, notice: "Reverted to #{regular_user_con_profile.name}."
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

  # Only allow people who can update arbitrary user con profiles for this convention to access this
  # controller. In other words, users shouldn't be able to access even their own profile here
  # (because they could use this controller to escalate their privileges).
  def authorize_admin_profiles
    authorize! :view_attendees, convention
  end
end
