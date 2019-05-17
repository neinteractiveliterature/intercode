class ApplicationController < ActionController::Base
  # Turn on Rails' built-in CSRF protection (see
  # http://guides.rubyonrails.org/security.html#cross-site-request-forgery-csrf)
  skip_forgery_protection if: :doorkeeper_token unless Rails.env.test?

  # CanCan's built-in nag filter that will throw an error if no authorization check was performed.
  # Only enabled for non-production environments.  To disable, do this in a controller:
  # skip_authorization_check
  check_authorization unless: :devise_or_doorkeeper_controller?

  # Make Devise work with Rails 4 strong parameters.  See the method below for details.
  before_action :configure_permitted_parameters, if: :devise_controller?

  # If we're in a convention, use the convention's timezone.
  around_action :use_convention_timezone

  # Make sure assumed identities stay on the domain they're supposed to be on
  before_action :ensure_assumed_identity_matches_convention

  # Make the user create their profile for this con if they haven't got one
  before_action :ensure_user_con_profile_exists, unless: :devise_controller?
  before_action :redirect_if_user_con_profile_needs_update, unless: :devise_controller?

  # Make sure the user accepts the clickwrap agreement if one exists
  before_action :ensure_clickwrap_agreement_accepted, unless: :devise_controller?

  delegate :cms_parent, :cadmus_renderer, :preload_cms_layout_content, to: :cms_rendering_context
  helper_method :cms_parent, :cadmus_renderer, :cms_rendering_context

  # Defines what to do if the current user doesn't have access to the page they're
  # trying to view.  In this case we'll either redirect to a login screen if they're not
  # logged in, or throw them back to the root URL with an error if they are.
  rescue_from CanCan::AccessDenied do |error|
    Rails.logger.warn(error.message)

    if user_signed_in?
      redirect_to root_url, alert: error.message
    else
      session[:user_return_to] = request.url
      redirect_to root_url(show_authentication: 'signIn')
    end
  end

  def graphql_authenticity_token
    form_authenticity_token(form_options: { action: graphql_path, method: 'POST' })
  end
  helper_method :graphql_authenticity_token

  def app_component_props
    {
      authenticityTokens: authenticity_token_props,
      recaptchaSiteKey: Recaptcha.configuration.site_key,
      stripePublishableKey: convention&.stripe_publishable_key
    }
  end
  helper_method :app_component_props

  def authenticity_token_props
    {
      graphql: graphql_authenticity_token,
      changePassword: form_authenticity_token(form_options: {
        action: user_password_path, method: 'PUT'
      }),
      denyAuthorization: form_authenticity_token(form_options: {
        action: oauth_authorization_path, method: 'DELETE'
      }),
      grantAuthorization: form_authenticity_token(form_options: {
        action: oauth_authorization_path, method: 'POST'
      }),
      resetPassword: form_authenticity_token(form_options: {
        action: user_password_path, method: 'POST'
      }),
      signIn: form_authenticity_token(form_options: {
        action: user_session_path, method: 'POST'
      }),
      signOut: form_authenticity_token(form_options: {
        action: destroy_user_session_path, method: 'DELETE'
      }),
      signUp: form_authenticity_token(form_options: {
        action: user_registration_path, method: 'POST'
      }),
      updateUser: form_authenticity_token(form_options: {
        action: user_registration_path, method: 'PATCH'
      })
    }
  end

  protected

  def current_ability
    @current_ability ||= Ability.new(current_user, doorkeeper_token)
  end

  # Returns the appropriate Convention object for the domain name of the request.  This relies on
  # the Intercode::FindVirtualHost Rack middleware having already run, since it sets the key
  # "intercode.convention" inside the Rack environment.
  def convention
    @convention ||= request.env['intercode.convention']
  end
  helper_method :convention

  def user_con_profile
    return unless convention && user_signed_in?
    @user_con_profile ||= convention.user_con_profiles.find_by(user_id: current_user.id)
  end
  helper_method :user_con_profile

  def assumed_identity_from_profile
    return unless session[:assumed_identity_from_profile_id]
    @assumed_identity_from_profile ||= UserConProfile.find(
      session[:assumed_identity_from_profile_id]
    )
  end
  helper_method :assumed_identity_from_profile

  def current_pending_order
    return unless user_con_profile

    @current_pending_order ||= begin
      pending_orders = user_con_profile.orders.pending.to_a
      return unless pending_orders.any?

      if pending_orders.size > 1
        # combine orders into one cart
        first_order = pending_orders.pop
        OrderEntry.where(order_id: pending_orders.map(&:id)).update_all(order_id: first_order.id)
        pending_orders.destroy_all
        first_order.reload
      else
        pending_orders.first
      end
    end
  end
  helper_method :current_pending_order

  def use_convention_timezone(&block)
    timezone = convention&.timezone

    if timezone
      Time.use_zone(timezone, &block)
    else
      yield
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
    devise_parameter_sanitizer.permit(:sign_up) do |user|
      user.permit(:email, :password, :password_confirmation, :remember_me, :first_name, :last_name)
    end
    devise_parameter_sanitizer.permit(:account_update) do |user|
      user.permit(
        :email, :password, :password_confirmation, :current_password, :first_name, :last_name
      )
    end
  end

  def after_sign_in_path_for(resource)
    if convention && convention.user_con_profiles.where(user_id: resource.id).none?
      return new_my_profile_path
    end

    if session[:user_return_to]
      session[:user_return_to]
    else
      root_path
    end
  end

  def ensure_user_con_profile_exists
    return unless convention && user_signed_in?
    return if user_con_profile

    @user_con_profile = current_user.user_con_profiles.build(
      first_name: current_user.first_name,
      last_name: current_user.last_name,
      convention_id: convention.id,
      needs_update: true
    )
    @user_con_profile.assign_default_values_from_form_items(
      convention.user_con_profile_form.form_items
    )
    copy_most_recent_profile_attributes(@user_con_profile)
    @user_con_profile.save!
  end

  def copy_most_recent_profile_attributes(destination_profile)
    return unless most_recent_profile

    destination_profile.assign_form_response_attributes(
      FormResponsePresenter.new(convention.user_con_profile_form, most_recent_profile).as_json
    )
  end

  def most_recent_profile
    return nil unless convention.organization_id

    @most_recent_profile ||= current_user.user_con_profiles.joins(:convention)
      .where(conventions: { organization_id: convention.organization_id })
      .order(Arel.sql('conventions.starts_at DESC'))
      .first
  end

  def redirect_if_user_con_profile_needs_update
    return unless user_con_profile&.needs_update?
    return if assumed_identity_from_profile
    return if request.path == '/my_profile/edit' || request.path == '/clickwrap_agreement'

    redirect_to '/my_profile/edit', notice: "Welcome to #{convention.name}!  You haven't signed \
into this convention before, so please take a moment to update your profile."
  end

  def ensure_clickwrap_agreement_accepted
    return unless convention && convention.clickwrap_agreement.present?
    return if assumed_identity_from_profile
    return unless user_con_profile && !user_con_profile.accepted_clickwrap_agreement?
    return if current_cms_page(request.path)&.skip_clickwrap_agreement?

    flash.clear
    redirect_to clickwrap_agreement_path
  end

  def ensure_assumed_identity_matches_convention
    return unless current_user && assumed_identity_from_profile
    return if assumed_identity_from_profile.convention == convention

    domain = assumed_identity_from_profile.convention.domain
    domain << ":#{request.port}"

    redirect_to "#{request.protocol}#{domain}#{request.path}", alert: "You used \"become user\" \
on the #{assumed_identity_from_profile.convention.name} site to assume the identity of \
#{current_user.name} for this session.  In order to visit other conventions' \
sites, please use the \"Revert to #{assumed_identity_from_profile.name}\" option above."
  end

  def no_cache
    response.headers['Cache-Control'] = 'no-cache, no-store, max-age=0, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = 'Fri, 01 Jan 1990 00:00:00 GMT'
  end

  def devise_or_doorkeeper_controller?
    return true if devise_controller?
    return true if self.class.name =~ /\ADoorkeeper::/
    false
  end

  def cms_rendering_context
    @cms_rendering_context ||= CmsRenderingContext.new(
      cms_parent: convention || RootSite.instance,
      controller: self,
      assigns: {
        'user' => current_user,
        'convention' => convention,
        'user_con_profile' => user_con_profile,
        'event' => event_for_path
      }
    )
  end

  def event_for_path
    return unless convention
    return @event_for_path if defined?(@event_for_path)

    @event_for_path = begin
      if (match = (%r{\A/events/(\d+)}.match(request.path)))
        convention.events.active.find(match[1])
      end
    end
  end

  def cms_parent
    convention || RootSite.instance
  end

  def current_cms_page(path)
    if (match = (%r{\A/pages/(.*)}.match(path)))
      cms_parent.pages.find_by(slug: match[1])
    elsif path == '/'
      cms_parent.root_page
    end
  end

  def effective_cms_layout(path)
    current_cms_page(path)&.cms_layout || cms_parent.default_layout
  end
  helper_method :effective_cms_layout
end
