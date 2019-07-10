class AuthenticityTokensController < ApplicationController
  skip_before_action :redirect_if_user_con_profile_needs_update
  skip_before_action :ensure_clickwrap_agreement_accepted

  def show
    render json: authenticity_token_props
  end
end
