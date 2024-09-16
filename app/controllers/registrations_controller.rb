# frozen_string_literal: true
class RegistrationsController < Devise::RegistrationsController
  include RedirectWithAuthentication

  prepend_before_action :check_captcha, only: [:create]
  prepend_before_action :disable_destroy, only: [:destroy]

  def new
    respond_to { |format| format.html { redirect_with_authentication("signUp") } }
  end

  private

  def check_captcha
    return if RootSite.instance.disable_captcha?
    return if verify_recaptcha

    configure_permitted_parameters # we prepended, so this won't have run
    self.resource = resource_class.new sign_up_params
    resource.validate # Look for any other validation errors besides Recaptcha
    resource.errors.add :recaptcha, "failed verification"
    respond_with resource
  end

  def disable_destroy
    redirect_to root_path, alert: "To delete your account, please email the site administrators."
  end
end
