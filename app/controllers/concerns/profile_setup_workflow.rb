# frozen_string_literal: true
module ProfileSetupWorkflow
  protected

  def ensure_user_con_profile_exists
    return unless convention && user_signed_in?
    return if user_con_profile

    result = SetupUserConProfileService.new(convention: convention, user: current_user, controller: self).call!
    @user_con_profile = result.user_con_profile
  end

  def redirect_if_user_con_profile_needs_update
    return unless user_con_profile&.needs_update?
    return if assumed_identity_from_profile
    return if request.path == "/my_profile/setup"
    return if current_page_skips_clickwrap_agreement?

    redirect_to "/my_profile/setup"
  end

  def ensure_clickwrap_agreement_accepted
    return unless clickwrap_agreement_present?
    return if assumed_identity_from_profile
    return unless user_con_profile && !user_con_profile.accepted_clickwrap_agreement?
    return if current_page_skips_clickwrap_agreement?

    flash.clear
    redirect_to "/clickwrap_agreement"
  end

  def clickwrap_agreement_present?
    convention && convention.clickwrap_agreement.present?
  end

  def current_page_skips_clickwrap_agreement?
    return true if request.path == "/clickwrap_agreement"
    current_cms_page(request.path)&.skip_clickwrap_agreement?
  end
end
