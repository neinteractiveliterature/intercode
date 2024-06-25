# frozen_string_literal: true
class ApplicationController < ActionController::Base
  ASSUMED_IDENTITY_SESSION_LOGGING_OMIT_HEADERS = Set.new(%w[Cookie X-Csrf-Token])

  include Pundit::Authorization
  include CmsContentHelpers
  include ProfileSetupWorkflow
  helper_method :effective_cms_layout

  # Turn on Rails' built-in CSRF protection (see
  # http://guides.rubyonrails.org/security.html#cross-site-request-forgery-csrf)
  protect_from_forgery
  skip_forgery_protection if: :doorkeeper_token unless Rails.env.test?

  # Make Devise work with Rails 4 strong parameters.  See the method below for details.
  before_action :configure_permitted_parameters, if: :devise_controller?

  # If we're in a convention, use the convention's timezone.
  around_action :use_convention_timezone

  # Log requests from assumed identity sessions
  before_action :log_assumed_identity_request

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
  rescue_from Pundit::NotAuthorizedError do |error|
    Rails.logger.warn(error.message)

    if user_signed_in?
      redirect_to root_url, alert: error.message
    else
      session[:user_return_to] = request.url
      redirect_to root_url(show_authentication: "signIn")
    end
  end

  def graphql_authenticity_token
    form_authenticity_token(form_options: { action: graphql_path, method: "POST" })
  end
  helper_method :graphql_authenticity_token

  def app_component_props
    {
      recaptchaSiteKey: Recaptcha.configuration.site_key,
      mapboxAccessToken: ENV["MAPBOX_ACCESS_TOKEN"],
      railsDirectUploadsUrl: rails_direct_uploads_url,
      railsDefaultActiveStorageServiceName: Rails.application.config.active_storage.service.to_s
    }
  end
  helper_method :app_component_props

  def browser_warning
    return nil if request.cookies["suppressBrowserWarning"] == "true"

    presenter = BrowserWarningPresenter.new(request.user_agent)
    return nil if presenter.supported?

    presenter.render
  end
  helper_method :browser_warning

  protected

  def pundit_user
    @pundit_user ||=
      AuthorizationInfo.new(
        current_user,
        doorkeeper_token,
        assumed_identity_from_profile: assumed_identity_from_profile,
        known_user_con_profiles: [user_con_profile, assumed_identity_from_profile].compact
      )
  end

  # Returns the appropriate Convention object for the domain name of the request.  This relies on
  # the Intercode::FindVirtualHost Rack middleware having already run, since it sets the key
  # "intercode.convention" inside the Rack environment.
  def convention
    @convention ||= request.env["intercode.convention"]
  end
  helper_method :convention

  def user_con_profile
    return unless convention && user_signed_in?
    @user_con_profile ||= convention.user_con_profiles.find_by(user_id: current_user.id)
  end
  helper_method :user_con_profile

  def assumed_identity_from_profile
    return unless session[:assumed_identity_from_profile_id]
    @assumed_identity_from_profile ||= UserConProfile.find(session[:assumed_identity_from_profile_id])
  end
  helper_method :assumed_identity_from_profile

  def assumed_identity_session
    return unless session[:assumed_identity_session_id]
    @assumed_identity_session ||= AssumedIdentitySession.find(session[:assumed_identity_session_id])
  end

  def current_pending_order
    return unless user_con_profile

    @current_pending_order ||=
      begin
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

  def timezone_for_request
    @timezone_for_request ||=
      if convention&.timezone_mode == "convention_local"
        convention.timezone
      elsif request.headers["X-Intercode-User-Timezone"].present?
        ActiveSupport::TimeZone[request.headers["X-Intercode-User-Timezone"]]
      end
  end

  def use_convention_timezone(&block)
    if timezone_for_request
      Notifier.use_timezone(timezone_for_request) { Time.use_zone(timezone_for_request, &block) }
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
      user.permit(:email, :password, :password_confirmation, :current_password, :first_name, :last_name)
    end
  end

  def after_sign_in_path_for(_resource)
    if session[:user_return_to]
      session[:user_return_to]
    elsif request.referer
      begin
        referer_uri = URI(request.referer)
        host_matches =
          %w[scheme host port].all? { |field| request.public_send(field) == referer_uri.public_send(field) }

        host_matches ? request.referer : root_path
      rescue StandardError
        root_path
      end
    else
      root_path
    end
  end

  def log_assumed_identity_request
    return unless current_user && assumed_identity_session

    assumed_identity_session.assumed_identity_request_logs.create!(assumed_identity_request_log_attributes)
  end

  def assumed_identity_request_log_attributes
    {
      controller_name: request.controller_class.name,
      action_name: action_name,
      http_method: request.method,
      url: request.url,
      ip_address: request.ip,
      http_headers:
        request
          .env
          .select { |k, _v| k.start_with? "HTTP_" }
          .transform_keys { |k| k.sub(/^HTTP_/, "").split("_").map(&:capitalize).join("-") }
          .reject { |k, _v| ASSUMED_IDENTITY_SESSION_LOGGING_OMIT_HEADERS.include?(k) },
      http_body: request.raw_post
    }
  end

  def ensure_assumed_identity_matches_convention
    return unless current_user && assumed_identity_from_profile
    return if assumed_identity_from_profile.convention == convention

    domain = assumed_identity_from_profile.convention.domain
    domain << ":#{request.port}"

    redirect_to "#{request.protocol}#{domain}#{request.path}",
                allow_other_host: true,
                alert:
                  "You used “become user” \
on the #{assumed_identity_from_profile.convention.name} site to assume the identity of \
#{current_user.name} for this session.  In order to visit other conventions’ \
sites, please use the “Revert to #{assumed_identity_from_profile.name}” option above."
  end

  def no_cache
    response.headers["Cache-Control"] = "no-cache, no-store, max-age=0, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "Fri, 01 Jan 1990 00:00:00 GMT"
  end

  def devise_or_doorkeeper_controller?
    return true if devise_controller?
    return true if self.class.name.start_with?("Doorkeeper::")
    false
  end
end
