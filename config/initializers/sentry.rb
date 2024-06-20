if ENV["SENTRY_DSN"].present?
  Sentry.init do |config|
    config.dsn = ENV.fetch("SENTRY_DSN")
    config.release = "intercode-#{ENV.fetch("REVISION")}" if ENV["REVISION"].present?

    config.traces_sample_rate = ENV.fetch("SENTRY_TRACES_SAMPLE_RATE", "0").to_f
    config.profiles_sample_rate = ENV.fetch("SENTRY_PROFILES_SAMPLE_RATE", "0").to_f
  end
end
