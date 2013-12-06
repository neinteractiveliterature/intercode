class ApplicationController < ActionController::Base
  protect_from_forgery
  after_filter :ensure_authorization_performed, :if => :auditing_security?, :unless => :devise_controller?

  # Defines what to do if the current user doesn't have access to the page they're
  # trying to view.
  def authority_forbidden(error)
    Authority.logger.warn(error.message)
    
    if user_signed_in?
      redirect_to root_url, :alert => error.message
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
  
  def auditing_security?
    Rails.env != 'production'
  end
  
  def current_or_anonymous_user
    if user_signed_in?
      current_user
    else
      User.new
    end
  end
end
