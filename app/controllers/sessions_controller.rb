# frozen_string_literal: true
class SessionsController < Devise::SessionsController
  include RedirectWithAuthentication

  layout :sign_in_layout
  prepend_before_action :set_return_to, only: [:new]

  def new
    if oauth_authorize_flow?
      super
    else
      respond_to { |format| format.html { redirect_with_authentication("signIn") } }
    end
  end

  private

  def sign_in_layout
    oauth_authorize_flow? ? "devise" : false
  end

  def set_return_to
    return if params[:user_return_to].blank?
    session[:user_return_to] = params[:user_return_to]
  end

  def oauth_authorize_flow?
    session[:user_return_to]&.start_with?("/oauth/authorize")
  end
end
