# frozen_string_literal: true

# Returns a minimal HTML document with Open Graph meta tags for a given path.
# Intended to be served to crawlers by a CDN edge function; regular browsers
# receive the static SPA shell instead.
class OgShellController < ApplicationController
  include CmsContentHelpers

  skip_before_action :ensure_user_con_profile_exists
  skip_before_action :redirect_if_user_con_profile_needs_update
  skip_before_action :ensure_clickwrap_agreement_accepted

  def show
    path = params[:path].presence || "/"
    @og_url = "#{request.scheme}://#{request.host_with_port}#{path}"
    @event = event_for_path(path)
    @page = current_cms_page(path)
    render layout: false
  end
end
