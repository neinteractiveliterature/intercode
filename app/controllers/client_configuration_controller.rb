# frozen_string_literal: true

# Returns the small bundle of config the SPA needs *before* it can fire any
# authenticated GraphQL queries (in particular, the OAuth client UID and OIDC
# issuer URL, without which the auto-refresh path can't construct a refresh
# request). Replaces the previous server-rendered `data-react-props` blob on
# the `AppRoot` div and the GraphQL `clientConfiguration` query.
class ClientConfigurationController < ApplicationController
  skip_before_action :ensure_user_con_profile_exists
  skip_before_action :redirect_if_user_con_profile_needs_update
  skip_before_action :ensure_clickwrap_agreement_accepted

  def show
    render json: {
             oauth_frontend_application_uid: Doorkeeper::Application.find_by(is_intercode_frontend: true)&.uid,
             oidc_issuer_url: oidc_issuer_url,
             # The SPA used to fetch these via the OIDC discovery document, but that's a
             # cross-origin request to the issuer host (a convention page reaching the root
             # site), which gets blocked (Brave shields, untrusted dev certs, etc.) and
             # leaves login hanging. Serving them here — same-origin — removes that
             # dependency. Built from the issuer URL so they point at the issuer host
             # rather than whatever convention host is making this request.
             oidc_authorization_endpoint: oidc_authorization_endpoint,
             oidc_end_session_endpoint: oidc_end_session_endpoint,
             rails_default_active_storage_service_name: Rails.application.config.active_storage.service.to_s,
             rails_direct_uploads_url: rails_direct_uploads_url,
             recaptcha_site_key: Recaptcha.configuration.site_key,
             assets_host: ENV["ASSETS_HOST"].presence,
             sentry_frontend_dsn: ENV["SENTRY_FRONTEND_DSN"].presence,
             rollbar_client_access_token: ENV["ROLLBAR_CLIENT_ACCESS_TOKEN"].presence
           }
  end

  private

  def oidc_authorization_endpoint
    URI.join(oidc_issuer_url, oauth_authorization_path).to_s
  end

  def oidc_end_session_endpoint
    URI.join(oidc_issuer_url, destroy_user_session_path).to_s
  end
end
