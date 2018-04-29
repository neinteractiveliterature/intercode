Recaptcha.configuration.hostname = ->(hostname) do
  (
    Rails.application.config.action_mailer.default_url_options[:host].gsub(/:\d+\z/, '') == hostname ||
    Convention.where(domain: hostname).any?
  )
end
