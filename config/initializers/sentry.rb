Sentry.init { |config| config.dsn = ENV.fetch("SENTRY_DSN") } if ENV["SENTRY_DSN"].present?
