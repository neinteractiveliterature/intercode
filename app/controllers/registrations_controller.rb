class RegistrationsController < Devise::RegistrationsController
  include RedirectWithAuthentication

  prepend_before_action :check_captcha, only: [:create]
  prepend_before_action :disable_destroy, only: [:destroy]

  def new
    respond_to do |format|
      format.html { redirect_with_authentication('signUp') }
    end
  end

  private

  def check_captcha
    return if verify_recaptcha

    self.resource = resource_class.new sign_up_params
    resource.validate # Look for any other validation errors besides Recaptcha
    respond_with_navigational(resource) { render :new }
  end

  def disable_destroy
    redirect_to root_path, alert: 'To delete your account, please email the site administrators.'
  end
end
