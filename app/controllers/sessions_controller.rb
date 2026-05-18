# frozen_string_literal: true
class SessionsController < Devise::SessionsController
  include RedirectWithAuthentication

  prepend_before_action :set_return_to, only: [:new]

  def new
    respond_to do |format|
      format.html do
        if oauth_authorize_flow?
          # Redirecting back to the OAuth URL would loop: Doorkeeper would
          # again see no signed-in user and send us right back here.  Instead,
          # open the sign-in modal on the root page; after sign-in Devise will
          # redirect to session[:user_return_to] (the OAuth URL).
          redirect_to root_url(show_authentication: "signIn")
        else
          redirect_with_authentication("signIn")
        end
      end
    end
  end

  private

  def oauth_authorize_flow?
    session[:user_return_to]&.start_with?("/oauth/authorize")
  end

  def set_return_to
    return if params[:user_return_to].blank?
    session[:user_return_to] = params[:user_return_to]
  end
end
