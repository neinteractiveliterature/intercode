class ClickwrapAgreementsController < ApplicationController
  skip_before_action :ensure_clickwrap_agreement_accepted
  skip_authorization_check

  def show
  end

  def accept
    user_con_profile.update!(accepted_clickwrap_agreement: true)
    redirect_to root_path
  end
end
