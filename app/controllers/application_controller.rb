class ApplicationController < ActionController::Base

  # Turn on Rails' built-in CSRF protection (see http://guides.rubyonrails.org/security.html#cross-site-request-forgery-csrf)
  protect_from_forgery with: :exception

  # Authority's built-in nag filter that will throw an error if no authorization check was performed.
  # Only enabled for non-production environments.  To disable, do this in a controller:
  # skip_authorization_check
  check_authorization :unless => :devise_controller?

  # Make Devise work with Rails 4 strong parameters.  See the method below for details.
  before_action :configure_permitted_parameters, if: :devise_controller?

  # Defines what to do if the current user doesn't have access to the page they're
  # trying to view.  In this case we'll either redirect to a login screen if they're not
  # logged in, or throw them back to the root URL with an error if they are.
  rescue_from CanCan::AccessDenied do |error|
    Rails.logger.warn(error.message)

    if user_signed_in?
      redirect_to root_url, :alert => error.message
    else
      session[:user_return_to] = request.url
      redirect_to new_user_session_url, :alert => "Please log in to view this page."
    end
  end

  protected

  # This allows any view template to say "convention" and get the current convention.
  # By default, there is none; this is overridden by BaseControllers::VirtualHost to
  # return the convention for the current domain.
  def convention
    nil
  end
  helper_method :convention

  # These variables will automatically be made available to Cadmus CMS content.  For
  # example, you'll be able to do {{ user.name }} in a page template.
  def liquid_assigns
    { "user" => current_user }
  end

  # These variables aren't available from Cadmus CMS templates, but are available to
  # custom Liquid filters and tags via the Liquid::Context object.  Exposing the
  # controller is useful for generating URLs in templates.
  def liquid_registers
    { "controller" => self }
  end

  # Devise is going to do some operations in its controllers that require writing to a
  # User object in the database.  For example, it handles the signup and forgot password
  # forms itself.  So, it needs to know about any special parameters we added onto those
  # forms so that Rails' strong parameters feature won't prevent those from going through.
  #
  # This is where we list all those parameters.  Right now, I've only added ones for
  # the sign_up action, because that's the only place we customized the form, but we might
  # need to add more later if we customize the other Devise forms too.
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up) do |user|
      user.permit(:email, :password, :password_confirmation, :remember_me, :first_name, :last_name)
    end
  end

  def after_sign_in_path_for(resource)
    if session[:register_via_convention_id]
      convention = Convention.find_by(id: session[:register_via_convention_id])
      if convention
        return my_profile_url(host: convention.domain)
      end
    end

    if request.env['intercode.convention'] && request.env['intercode.convention'].user_con_profiles.where(user_id: resource.id).blank?
      return new_my_profile_path
    end

    if session[:user_return_to]
      session[:user_return_to]
    else
      root_path
    end
  end
end
