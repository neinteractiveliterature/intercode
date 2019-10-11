class SessionsController < Devise::SessionsController
  include RedirectWithAuthentication

  prepend_before_action :set_return_to, only: [:new, :create]

  def new
    respond_to do |format|
      format.html { redirect_with_authentication('signIn') }
    end
  end

  private

  def set_return_to
    return unless params[:user_return_to].present?
    session[:user_return_to] = params[:user_return_to]
  end
end
