# frozen_string_literal: true

# The SPA fallback route: every path Rails doesn't otherwise handle. Browsers get the frontend's page (see
# render_spa_shell). With a static shell (see StaticSpaShell), crawlers get the same Open Graph document as /og-shell
# instead, since a static page can't carry per-resource metadata; the response then depends on the user agent, so it is
# marked Vary: User-Agent and not cached by shared caches. The redirects for profile setup and clickwrap agreements are
# left to the app.
class SpaShellController < ApplicationController
  include CmsContentHelpers

  skip_before_action :ensure_user_con_profile_exists
  skip_before_action :redirect_if_user_con_profile_needs_update
  skip_before_action :ensure_clickwrap_agreement_accepted

  def show
    return render_spa_shell unless StaticSpaShell.enabled?

    response.headers["Vary"] = "User-Agent"
    StaticSpaShell.crawler?(request.user_agent) ? render_open_graph_document : render_spa_shell
  end

  private

  def render_open_graph_document
    response.headers["Cache-Control"] = "max-age=0, private"
    @og_url = "#{request.scheme}://#{request.host_with_port}#{request.path}"
    @event = event_for_path(request.path)
    @page = current_cms_page(request.path)
    # The path may end in an extension (e.g. /.well-known/assetlinks.json), but the document is always HTML
    render template: "og_shell/show", formats: [:html], layout: false
  end
end
