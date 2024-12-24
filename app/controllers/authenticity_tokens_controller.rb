# frozen_string_literal: true
class AuthenticityTokensController < ApplicationController
  skip_before_action :redirect_if_user_con_profile_needs_update
  skip_before_action :ensure_clickwrap_agreement_accepted

  def show
    render json: {
             graphql: graphql_authenticity_token,
             changePassword: form_authenticity_token(form_options: { action: user_password_path, method: "PUT" }),
             denyAuthorization:
               form_authenticity_token(form_options: { action: oauth_authorization_path, method: "DELETE" }),
             grantAuthorization:
               form_authenticity_token(form_options: { action: oauth_authorization_path, method: "POST" }),
             railsDirectUploads:
               form_authenticity_token(form_options: { action: rails_direct_uploads_path, method: "POST" }),
             resetPassword: form_authenticity_token(form_options: { action: user_password_path, method: "POST" }),
             signIn: form_authenticity_token(form_options: { action: user_session_path, method: "POST" }),
             signOut: form_authenticity_token(form_options: { action: destroy_user_session_path, method: "DELETE" }),
             signUp: form_authenticity_token(form_options: { action: user_registration_path, method: "POST" }),
             updateUser: form_authenticity_token(form_options: { action: user_registration_path, method: "PATCH" })
           }
  end
end
