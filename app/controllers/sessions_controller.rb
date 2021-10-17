# frozen_string_literal: true
class SessionsController < Devise::SessionsController
  include RedirectWithAuthentication

  prepend_before_action :set_return_to, only: %i[new create]

  def new
    respond_to { |format| format.html { redirect_with_authentication('signIn') } }
  end

  private

  def set_return_to
    return if params[:user_return_to].blank?
    session[:user_return_to] = params[:user_return_to]
  end
end
