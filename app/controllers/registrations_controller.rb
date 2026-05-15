# frozen_string_literal: true
class RegistrationsController < Devise::RegistrationsController
  include RedirectWithAuthentication

  prepend_before_action :check_captcha, only: [:create] # rubocop:disable Rails/LexicallyScopedActionFilter
  prepend_before_action :disable_destroy, only: [:destroy] # rubocop:disable Rails/LexicallyScopedActionFilter

  def new
    render html: "", layout: "application"
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
    redirect_to root_path, alert: "To delete your account, please email the site administrators." # rubocop:disable Rails/I18nLocaleTexts
  end
end
