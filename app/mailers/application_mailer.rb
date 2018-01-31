class ApplicationMailer < ActionMailer::Base
  default from: "intercode@#{Rails.application.config.action_mailer.default_url_options.try(:[], :host)}"
  layout 'mailer'
end
