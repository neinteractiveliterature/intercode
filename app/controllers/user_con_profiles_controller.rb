# frozen_string_literal: true
class UserConProfilesController < ApplicationController
  include SendCsv

  # Normally we'd just use the name of the resource as the instance variable name.  Here that'd be
  # @user_con_profile, which is unsafe for us to use because ApplicationController uses it to mean
  # the current user, and we use that for authorization checking.  So instead, we'll call the user
  # con profile we're working on the "subject profile" (as in the subject of our actions).
  before_action :authorize_admin_profiles, except: [:revert_become]

  skip_before_action :verify_authenticity_token, only: %i[become revert_become] unless Rails.env.test?

  def become
    identity_assumer = assumed_identity_from_profile || user_con_profile
    subject_profile = convention.user_con_profiles.find(params[:id])
    authorize subject_profile, :become?

    new_session =
      AssumedIdentitySession.new(
        assumed_profile: subject_profile,
        assumer_profile: identity_assumer,
        justification: params[:justification],
        started_at: Time.now
      )

    unless new_session.save
      respond_to { |format| format.json { render json: { errors: new_session.errors }, status: :unprocessable_entity } }
      return
    end

    sign_in subject_profile.user
    session[:assumed_identity_from_profile_id] = identity_assumer.id
    session[:assumed_identity_session_id] = new_session.id
    redirect_to root_url
  end

  def revert_become
    unless assumed_identity_from_profile
      return(
        redirect_to(
          root_url,
          alert:
            "You haven't assumed an identity, so you can't revert \
back to your normal identity (since you already are your normal identity)."
        )
      )
    end

    current_session = assumed_identity_session

    regular_user_con_profile = assumed_identity_from_profile
    sign_in regular_user_con_profile.user
    session.delete(:assumed_identity_from_profile_id)
    session.delete(:assumed_identity_session_id)
    current_session&.update!(finished_at: Time.now) if current_session
    redirect_to root_url
  end

  private

  # Only allow people who can update arbitrary user con profiles for this convention to access this
  # controller. In other words, users shouldn't be able to access even their own profile here
  # (because they could use this controller to escalate their privileges).
  def authorize_admin_profiles
    authorize convention, :view_attendees?
  end
end
