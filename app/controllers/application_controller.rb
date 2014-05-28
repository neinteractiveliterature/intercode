class ApplicationController < ActionController::Base
  
  # Turn on Rails' built-in CSRF protection (see http://guides.rubyonrails.org/security.html#cross-site-request-forgery-csrf)
  protect_from_forgery
  
  # Authority's built-in nag filter that will throw an error if no authorization check was performed.
  # Only enabled for non-production environments.  To disable, do something like this in a controller:
  # skip_after_filter :ensure_authorization_performed
  after_filter :ensure_authorization_performed, :if => :auditing_security?, :unless => :devise_controller?
  
  # Make Devise work with Rails 4 strong parameters.  See the method below for details.
  before_filter :configure_permitted_parameters, if: :devise_controller?

  # Defines what to do if the current user doesn't have access to the page they're
  # trying to view.  In this case we'll either redirect to a login screen if they're not
  # logged in, or throw them back to the root URL with an error if they are.
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
  
  # This is used by the ensure_authorization_performed filter above, to check whether
  # that filter should be enabled.  In this case we want it enabled for all environments
  # except production.  (Code without authorization checks shouldn't make it to prod,
  # but if it does, we don't want it throwing errors at users.)
  def auditing_security?
    Rails.env != 'production'
  end
  
  # This is used by Authority (see config/initializers/authority.rb for where it's set up)
  # to get the current user object.  It needs to have something that includes the
  # Authority::UserAbilities module, so that it can call stuff like user.can_read?(object).
  # If there isn't a current user signed in, then we construct an in-memory anonymous User
  # object with no permissions so that anything requiring special permissions will fail.
  def current_or_anonymous_user
    if user_signed_in?
      current_user
    else
      User.new
    end
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
    devise_parameter_sanitizer.for(:sign_up) do |user|
      user.permit(:email, :password, :password_confirmation, :remember_me, :first_name, :last_name, :nickname, :birth_date, :default_gender, :phone)
    end
    devise_parameter_sanitizer.for(:account_update) do |user|
      user.permit(:email, :password, :password_confirmation, :first_name, :last_name, :nickname, :birth_date, :default_gender, :phone, :current_password)
    end
  end
end
