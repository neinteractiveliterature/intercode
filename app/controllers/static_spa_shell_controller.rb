# frozen_string_literal: true

# The SPA fallback route when STATIC_SHELL_DIR is set (see StaticSpaShell): browsers get the prebuilt static
# index.html, and crawlers get the same Open Graph document as /og-shell, since a static page can't carry per-resource
# metadata. The response depends on the user agent, so it is marked Vary: User-Agent and not cached by shared caches.
class StaticSpaShellController < ApplicationController
  include CmsContentHelpers

  skip_before_action :ensure_user_con_profile_exists
  skip_before_action :redirect_if_user_con_profile_needs_update
  skip_before_action :ensure_clickwrap_agreement_accepted

  def show
    response.headers["Vary"] = "User-Agent"

    if StaticSpaShell.crawler?(request.user_agent)
      response.headers["Cache-Control"] = "max-age=0, private"
      @og_url = "#{request.scheme}://#{request.host_with_port}#{request.path}"
      @event = event_for_path(request.path)
      @page = current_cms_page(request.path)
      render template: "og_shell/show", layout: false
    else
      response.headers["Cache-Control"] = "no-cache"
      send_file StaticSpaShell.index_path, type: "text/html", disposition: "inline"
    end
  end
end
