class ApplicationController < ActionController::Base
  protect_from_forgery
  check_authorization :unless => :devise_controller?

  # Defines what to do if the current user doesn't have access to the page they're
  # trying to view.
  rescue_from CanCan::AccessDenied do |exception|
    if user_signed_in?
      redirect_to root_url, :alert => exception.message
    else
      session[:user_return_to] = request.url
      redirect_to new_user_session_url, :alert => "Please log in to view this page."
    end
  end
  
  protected
  def liquid_assigns
    { "user" => current_user }
  end
  
  def liquid_registers
    { "controller" => self }
  end
end
