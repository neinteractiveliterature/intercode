# frozen_string_literal: true
class SessionsController < Devise::SessionsController
  include RedirectWithAuthentication

  layout :sign_in_layout
  prepend_before_action :set_return_to, only: [:new]

  def new
    if oauth_authorize_flow?
      super
    else
      respond_to { |format| format.html { redirect_with_authentication("signIn") } }
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
    trusted_sign_out_origin?(referer_uri.host) ? request.referer : nil
  end

  def parse_uri_silently(url)
    URI(url)
  rescue StandardError
    nil
  end

  def trusted_sign_out_origin?(host)
    intercode_host = ENV.fetch("INTERCODE_HOST", nil)
    host == intercode_host || (intercode_host && host&.end_with?(".#{intercode_host}")) ||
      Convention.exists?(domain: host)
  end

  def sign_in_layout
    oauth_authorize_flow? ? "devise" : false
  end

  def set_return_to
    return if params[:user_return_to].blank?
    session[:user_return_to] = params[:user_return_to]
  end

  def oauth_authorize_flow?
    session[:user_return_to]&.start_with?("/oauth/authorize")
  end
end
