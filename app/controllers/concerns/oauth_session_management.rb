# frozen_string_literal: true

# Shared logic for managing the SPA's OAuth session cookie across controllers
# that need to swap the active user (e.g. the "become user" feature).
module OAuthSessionManagement
  REFRESH_COOKIE_NAME = "__Host-intercode_refresh"

  private

  def issue_oauth_session_for_user(user)
    frontend_app = OAuthApplication.find_by(is_intercode_frontend: true)
    return unless frontend_app

    revoke_current_oauth_session

    new_token = create_frontend_access_token(user, frontend_app)
    cookies[REFRESH_COOKIE_NAME] = {
      value: new_token.plaintext_refresh_token,
      httponly: true,
      secure: true,
      same_site: :strict,
      path: "/",
      max_age: 90.days.to_i
    }
  end

  def create_frontend_access_token(user, frontend_app)
    scopes = Doorkeeper.config.scopes.to_s
    # Mirror the custom_access_token_expires_in block in config/initializers/doorkeeper.rb
    expires_in =
      Doorkeeper::OAuth::Scopes.from_string(scopes).any? { |s| s.start_with?("manage_") } ? 30.minutes : 2.weeks
    Doorkeeper::AccessToken.create!(
      application: frontend_app,
      resource_owner_id: user.id,
      scopes: scopes,
      expires_in: expires_in,
      use_refresh_token: true
    )
  end

  def revoke_current_oauth_session
    refresh_value = cookies[REFRESH_COOKIE_NAME]
    return if refresh_value.blank?

    Doorkeeper::AccessToken.by_refresh_token(refresh_value)&.revoke
  end
end
