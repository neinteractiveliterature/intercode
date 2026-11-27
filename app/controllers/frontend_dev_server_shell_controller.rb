# frozen_string_literal: true

# The SPA fallback route in development, when the framework-mode dev server is in use (see FrontendDevServer). Like
# StaticSpaShellController, it leaves the redirects for profile setup and clickwrap agreements to the app.
class FrontendDevServerShellController < ApplicationController
  skip_before_action :ensure_user_con_profile_exists
  skip_before_action :redirect_if_user_con_profile_needs_update
  skip_before_action :ensure_clickwrap_agreement_accepted

  def show
    render_spa_shell
  end
end
