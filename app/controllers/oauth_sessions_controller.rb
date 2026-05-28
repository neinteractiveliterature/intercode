# frozen_string_literal: true

# Mediates the SPA's OAuth session via an HttpOnly cookie so the long-lived
# refresh token never has to live in JavaScript-readable storage.
#
#   POST /oauth_session/exchange  — finalize the PKCE auth_code grant
#   POST /oauth_session/refresh   — rotate the cookie, mint a new access token
#   POST /oauth_session/sign_out  — revoke the row, clear the cookie
#
# CSRF: `refresh` and `sign_out` both read the SameSite=Strict HttpOnly cookie,
# so SameSite=Strict alone stops cross-site requests from doing anything useful
# (the cookie won't be sent). `exchange` *sets* that cookie, so SameSite alone
# is not sufficient — a cross-origin form POST would still be processed and the
# response Set-Cookie header would be accepted by the browser. We therefore
# validate the Origin header on `exchange` against known trusted hosts.
class OAuthSessionsController < ApplicationController
  COOKIE_NAME = "__Host-intercode_refresh"

  skip_before_action :verify_authenticity_token
  before_action :verify_trusted_origin!, only: :exchange
  skip_before_action :ensure_user_con_profile_exists
  skip_before_action :redirect_if_user_con_profile_needs_update
  skip_before_action :ensure_clickwrap_agreement_accepted

  def exchange
    return render_oauth_error(:invalid_request, "code is required", status: :bad_request) if params[:code].blank?

    frontend_app = OAuthApplication.find_by(is_intercode_frontend: true)
    return render_oauth_error(:invalid_client, status: :bad_request) unless frontend_app

    grant = Doorkeeper.config.access_grant_model.by_token(params[:code])
    return render_oauth_error(:invalid_grant, status: :bad_request) unless grant

    client = Doorkeeper::OAuth::Client.find(frontend_app.uid)
    request =
      Doorkeeper::OAuth::AuthorizationCodeRequest.new(
        Doorkeeper.config,
        grant,
        client,
        redirect_uri: params[:redirect_uri],
        code_verifier: params[:code_verifier]
      )

    respond_with_token_request(request)
  end

  def refresh
    refresh_token_value = cookies[COOKIE_NAME]
    return render_oauth_error(:invalid_grant, status: :unauthorized) if refresh_token_value.blank?

    access_token = Doorkeeper::AccessToken.by_refresh_token(refresh_token_value)
    return render_oauth_error(:invalid_grant, status: :unauthorized) if access_token.nil?

    frontend_app = OAuthApplication.find_by(is_intercode_frontend: true)
    return render_oauth_error(:invalid_client, status: :bad_request) unless frontend_app

    # Public client: secret is nil. `RefreshTokenRequest` requires credentials
    # whenever the token row has an `application_id`, even for public clients.
    credentials = Doorkeeper::OAuth::Client::Credentials.new(frontend_app.uid, nil)
    request = Doorkeeper::OAuth::RefreshTokenRequest.new(Doorkeeper.config, access_token, credentials)

    respond_with_token_request(request)
  end

  def sign_out
    refresh_token_value = cookies[COOKIE_NAME]
    if refresh_token_value.present?
      access_token = Doorkeeper::AccessToken.by_refresh_token(refresh_token_value)
      access_token&.revoke
    end
    clear_refresh_cookie
    head :no_content
  end

  private

  def respond_with_token_request(request)
    response = request.authorize
    if response.is_a?(Doorkeeper::OAuth::ErrorResponse)
      clear_refresh_cookie
      render json: response.body, status: response.status
      return
    end

    body = response.body
    set_refresh_cookie(body["refresh_token"]) if body["refresh_token"].present?
    render json: {
             access_token: body["access_token"],
             token_type: body["token_type"],
             expires_in: body["expires_in"],
             scope: body["scope"]
           }
  end

  # rubocop:disable Naming/AccessorMethodName -- not a setter on the controller; writes to the cookie jar
  def set_refresh_cookie(value)
    cookies[COOKIE_NAME] = { value: value, **cookie_attributes }
  end
  # rubocop:enable Naming/AccessorMethodName

  def clear_refresh_cookie
    cookies.delete(COOKIE_NAME, **cookie_attributes)
  end

  # `__Host-` prefix requires `Secure`, no `Domain`, and `Path=/`. Browsers
  # reject cookies with that prefix that don't meet these conditions.
  def cookie_attributes
    { httponly: true, secure: true, same_site: :strict, path: "/" }
  end

  def render_oauth_error(error_code, description = nil, status:)
    body = { error: error_code }
    body[:error_description] = description if description
    render json: body, status: status
  end

  def verify_trusted_origin!
    origin = request.origin
    # Requests without an Origin header (e.g., direct server-to-server calls)
    # are allowed; browsers always send Origin on cross-origin POSTs.
    return if origin.blank?

    host = URI.parse(origin).host
    return if trusted_origin?(host)

    render_oauth_error(:invalid_request, "untrusted origin", status: :forbidden)
  rescue URI::InvalidURIError
    render_oauth_error(:invalid_request, "invalid origin", status: :forbidden)
  end

  def trusted_origin?(host)
    return false if host.blank?
    intercode_host = ENV.fetch("INTERCODE_HOST", nil)
    host == intercode_host || (intercode_host.present? && host.end_with?(".#{intercode_host}")) ||
      Convention.exists?(domain: host)
  end
end
