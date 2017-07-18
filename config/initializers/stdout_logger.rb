if ENV["RAILS_LOG_TO_STDOUT"].present?
  config.logger = ActiveSupport::TaggedLogging.new(Logger.new(STDOUT))
end