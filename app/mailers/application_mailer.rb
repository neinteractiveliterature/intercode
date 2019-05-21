class ApplicationMailer < ActionMailer::Base
  include Concerns::AbsoluteUrls

  default(
    from: "intercode@#{Rails.application.config.action_mailer.default_url_options.try(:[], :host)}"
  )

  layout 'mailer'

  protected

  def from_address_for_convention(convention)
    "#{convention.name} <noreply@#{convention.domain}>"
  end

  def use_convention_timezone(convention, &block)
    timezone = convention&.timezone

    if timezone
      Time.use_zone(timezone, &block)
    else
      yield
    end
  end
end
