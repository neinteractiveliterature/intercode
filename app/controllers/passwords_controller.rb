class PasswordsController < Devise::PasswordsController
  def create
    resource = resource_class.find_by(email: resource_params[:email])
    resource.reset_password_mail_options = {
      host: request.host,
      port: request.port,
      protocol: request.protocol
    }
    resource.send_reset_password_instructions
    yield resource if block_given?

    if successfully_sent?(resource)
      respond_with({}, location: after_sending_reset_password_instructions_path_for(resource_name))
    else
      respond_with(resource)
    end
  end
end
