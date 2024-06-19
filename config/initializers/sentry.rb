if ENV["SENTRY_DSN"].present?
  Sentry.init do |config|
    config.dsn = ENV.fetch("SENTRY_DSN")
    config.release = "intercode-#{ENV.fetch("REVISION")}" if ENV["REVISION"].present?
  end
end
