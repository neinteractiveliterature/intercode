class ApplicationMailer < ActionMailer::Base
  default(
    from: "intercode@#{Rails.application.config.action_mailer.default_url_options.try(:[], :host)}"
  )

  layout 'mailer'

  protected

  def default_url_scheme
    Rails.env.production? ? 'https' : 'http'
  end

  def url_with_host(url, host, scheme: nil)
    uri = URI(url)
    uri.host = host
    uri.scheme = (scheme || default_url_scheme)
    uri.to_s
  end

  def url_with_convention_host(url, convention)
    url_with_host(url, convention.domain)
  end

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
