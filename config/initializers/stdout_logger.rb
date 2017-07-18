if ENV["RAILS_LOG_TO_STDOUT"].present?
  Rails.application.configure do
    logger           = ActiveSupport::Logger.new(STDOUT)
    logger.formatter = config.log_formatter
    config.logger    = ActiveSupport::TaggedLogging.new(logger)
  end
end