# frozen_string_literal: true
class SessionsController < Devise::SessionsController
  layout false
  prepend_before_action :set_return_to, only: [:new]

  def new
    render html: "", layout: "application"
  end

  # Override to allow cross-host redirect back to the convention subdomain after sign-in.
  def create
    self.resource = warden.authenticate!(auth_options)
    set_flash_message!(:notice, :signed_in)
    sign_in(resource_name, resource)
    path = after_sign_in_path_for(resource)
    uri = parse_uri_silently(path.to_s)
    redirect_to path, allow_other_host: uri&.host.present? && trusted_origin?(uri.host)
  end

  # Revoke the user's intercode-frontend access tokens before Devise tears down
  # the session, so any JWT copy that may have been exfiltrated (e.g. via XSS)
  # stops working at sign-out time. This also revokes the refresh tokens that
  # share the same DB row. Intentionally revokes across all of the user's
  # browser sessions, since signing out is a "secure my account" action.
  def destroy
    revoke_frontend_access_tokens_for(current_user) if current_user
    super
  end

  # Override to allow cross-host redirect back to the convention subdomain after sign-out.
  def respond_to_on_destroy(non_navigational_status: :no_content)
    respond_to do |format|
      format.all { head non_navigational_status }
      format.any(*navigational_formats) do
        redirect_to after_sign_out_path_for(resource_name),
                    status: Devise.responder.redirect_status,
                    allow_other_host: true
      end
    end
  end

  private

  def after_sign_out_path_for(_resource_or_scope)
    trusted_referer_url || root_path
  end

  def trusted_referer_url
    return unless request.referer

    referer_uri = parse_uri_silently(request.referer)
    return unless referer_uri

    trusted_origin?(referer_uri.host) ? request.referer : nil
  end

  def parse_uri_silently(url)
    URI(url)
  rescue StandardError
    nil
  end

  def trusted_origin?(host)
    intercode_host = ENV.fetch("INTERCODE_HOST", nil)
    host == intercode_host || (intercode_host && host&.end_with?(".#{intercode_host}")) ||
      Convention.exists?(domain: host)
  end

  def set_return_to
    return if params[:user_return_to].blank?
    session[:user_return_to] = params[:user_return_to]
  end

  def revoke_frontend_access_tokens_for(user)
    frontend_app = OAuthApplication.find_by(is_intercode_frontend: true)
    return unless frontend_app

    # rubocop:disable Rails/SkipsModelValidations -- Doorkeeper's own `AccessToken#revoke` uses `update_column`;
    # no validations need to run when stamping revoked_at, and a single UPDATE is cheaper than per-row `.revoke`.
    Doorkeeper::AccessToken.where(
      resource_owner_id: user.id,
      application_id: frontend_app.id,
      revoked_at: nil
    ).update_all(revoked_at: Time.current)
    # rubocop:enable Rails/SkipsModelValidations
  end
end
