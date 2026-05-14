# frozen_string_literal: true
class Types::ClientConfigurationType < Types::BaseObject
  description "Client-side configuration values needed for frontend initialization"

  field :oauth_frontend_application_uid,
        String,
        null: true,
        description: "The OAuth application UID for the Intercode frontend SPA (used for PKCE auth)"
  field :oidc_issuer_url,
        String,
        null: true,
        description: "The OIDC issuer URL (used as the base for OpenID Connect discovery)"
  field :rails_default_active_storage_service_name,
        String,
        null: false,
        description: "The default Active Storage service name configured in Rails"
  # rubocop:disable GraphQL/ExtractType
  field :rails_direct_uploads_url, String, null: false, description: "The URL endpoint for Rails Direct Uploads"
  # rubocop:enable GraphQL/ExtractType
  field :recaptcha_site_key, String, null: false, description: "The reCAPTCHA site key for client-side verification"

  def rails_default_active_storage_service_name
    Rails.application.config.active_storage.service.to_s
  end

  def rails_direct_uploads_url
    context[:controller].rails_direct_uploads_url
  end

  def recaptcha_site_key
    Recaptcha.configuration.site_key
  end

  def oauth_frontend_application_uid
    Doorkeeper::Application.find_by(is_intercode_frontend: true)&.uid
  end

  def oidc_issuer_url
    issuer = Doorkeeper::OpenidConnect.configuration.issuer
    issuer.respond_to?(:call) ? issuer.call : issuer
  end
end
