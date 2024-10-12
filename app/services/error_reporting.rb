class ErrorReporting
  RUBY_LOGGER_LEVELS = {
    fatal: Logger::FATAL,
    error: Logger::ERROR,
    warning: Logger::WARN,
    log: Logger::INFO,
    info: Logger::INFO,
    debug: Logger::DEBUG
  }

  ROLLBAR_LEVELS = {
    fatal: 'critical',
    error: 'error',
    warning: 'warning',
    log: 'info',
    info: 'info',
    debug: 'debug'
  }

  SENTRY_LEVELS = {
    fatal: :fatal,
    error: :error,
    warning: :warning,
    log: :log,
    info: :info,
    debug: :debug
  }

  def self.report(level, error, **extra)
    Rails.logger.add(RUBY_LOGGER_LEVELS.fetch(level), error:, **extra)

    if Rollbar.configuration.enabled
      Rollbar.log(ROLLBAR_LEVELS.fetch(level), error, **extra)
    end

    return unless Sentry.initialized?
    send_to_sentry(error, level: SENTRY_LEVELS.fetch(level), **extra)
  end

  %i[fatal error warning log info debug].each do |level|
    define_singleton_method level do |error, **extra|
      report(level, error, **extra)
    end
  end

  def self.warn(error, **extra)
    report(:warning, error, **extra)
  end

  def self.critical(error, **extra)
    report(:fatal, error, **extra)
  end

  def self.send_to_sentry(error, level:, tags: nil, **extra)
    Sentry.with_scope do |scope|
      scope.set_context("extra", extra) if extra.present?
      scope.set_tags(tags) if tags.present?

      case error
      when Exception
        Sentry.capture_exception(error, level:)
      else
        Sentry.capture_message(error, level:)
      end
    end
  end
end
