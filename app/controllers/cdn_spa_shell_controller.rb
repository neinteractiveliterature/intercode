# frozen_string_literal: true

# Serves a minimal SPA shell with only convention-level Open Graph metadata.
# Intended as the CloudFront origin for regular (non-crawler) user requests;
# crawler requests are routed to OgShellController by a Lambda@Edge function.
class CdnSpaShellController < ApplicationController
  skip_before_action :ensure_user_con_profile_exists
  skip_before_action :redirect_if_user_con_profile_needs_update
  skip_before_action :ensure_clickwrap_agreement_accepted

  def show
    expires_in 1.day, public: true

    if StaticSpaShell.enabled?
      # Per-convention title and favicon are set by the app from /client_configuration instead (see _boot_preloads)
      send_file StaticSpaShell.index_path, type: "text/html", disposition: "inline"
    else
      render html: "".html_safe, layout: "cdn_spa_shell"
    end
  end
end
