# frozen_string_literal: true
class PasswordsController < Devise::PasswordsController
  def new
    render html: "", layout: "application"
  end

  def create
    self.resource =
      resource_class.find_or_initialize_with_errors(resource_class.reset_password_keys, resource_params, :not_found)

    actually_do_reset

    yield resource if block_given?

    if successfully_sent?(resource)
      respond_with({}, location: after_sending_reset_password_instructions_path_for(resource_name))
    else
      respond_with(resource)
    end
  end

  private

  def actually_do_reset
    return unless resource.persisted?

    mailer_url_options = ActionMailer::Base.default_url_options
    resource.reset_password_mail_options = {
      host: mailer_url_options[:host],
      port: mailer_url_options[:port],
      protocol: mailer_url_options[:protocol] || request.protocol
    }

    resource.send_reset_password_instructions
  end
end
