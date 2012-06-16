class ApplicationController < ActionController::Base
  protect_from_forgery
  check_authorization :unless => :devise_controller?
  before_filter :con

  # Defines what to do if the current user doesn't have access to the page they're
  # trying to view.
  rescue_from CanCan::AccessDenied do |exception|
    redirect_to root_url, :alert => exception.message
  end
  
  protected
  def virtual_host
    @virtual_host ||= VirtualHost.find_by_domain(request.domain)
  end
  
  def con
    @con ||= virtual_host.con if virtual_host
  end
end
