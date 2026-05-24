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
             rails_default_active_storage_service_name: Rails.application.config.active_storage.service.to_s,
             rails_direct_uploads_url: rails_direct_uploads_url,
             recaptcha_site_key: Recaptcha.configuration.site_key
           }
  end
end
