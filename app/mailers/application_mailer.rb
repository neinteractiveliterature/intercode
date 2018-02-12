class ApplicationMailer < ActionMailer::Base
  default(
    from: "intercode@#{Rails.application.config.action_mailer.default_url_options.try(:[], :host)}"
  )

  layout 'mailer'

  protected

  def from_address_for_convention(convention)
    "#{convention.name} <noreply@#{convention.domain}>"
  end
end
