class ClickwrapAgreementsController < ApplicationController
  skip_before_action :ensure_user_con_profile_exists
  skip_before_action :ensure_clickwrap_agreement_accepted
  skip_authorization_check

  before_action :ensure_clickwrap_agreement_not_accepted

  def show
  end

  def accept
    user_con_profile.update!(accepted_clickwrap_agreement: true)
    redirect_to root_path
  end

  private

  def ensure_clickwrap_agreement_not_accepted
    return if user_con_profile && !user_con_profile.accepted_clickwrap_agreement

    redirect_to root_url
  end
end
