class UserMailer < Devise::Mailer
  attr_accessor :default_url_host, :default_url_port, :default_url_protocol
  default from: -> (mailer = nil) {
    UserMailer.from_address_for_mailer(mailer)
  }
  default reply_to: -> (mailer = nil) {
    UserMailer.from_address_for_mailer(mailer)
  }

  def default_url_options
    app_defaults = Rails.application.config.action_mailer.default_url_options || {}

    {
      host: default_url_host || app_defaults[:host],
      port: default_url_port || app_defaults[:port],
      protocol: default_url_protocol || app_defaults[:protocol]
    }
  end

  def reset_password_instructions(record, token, opts = {})
    self.default_url_host = opts.delete(:host)
    self.default_url_port = opts.delete(:port)
    self.default_url_protocol = opts.delete(:protocol)

    @token = token
    devise_mail(record, :reset_password_instructions, opts)
  end

  def self.default_url_options_for_mailer(mailer = nil)
    return mailer.default_url_options if mailer
    Rails.application.config.action_mailer.default_url_options
  end

  def self.from_address(default_host)
    if default_host
      # get rid of port number if it's there
      just_hostname = URI.parse("http://#{default_host}").host

      # Awful awful shenanigans: get the last up-to-two dot-separated parts of the hostname.
      # So: localhost stays as localhost
      # www.interconlarp.org becomes interconlarp.org
      second_level_domain = just_hostname.split('.').reverse.take(2).reverse.join('.')

      "webmaster@#{second_level_domain}"
    else
      'please-set-up-default-url-options@example.com'
    end
  end

  def self.from_address_for_mailer(mailer = nil)
    url_options = default_url_options_for_mailer(mailer)
    UserMailer.from_address(url_options[:host])
  end
end
