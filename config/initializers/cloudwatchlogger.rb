if ENV['CLOUDWATCH_LOG_GROUP']
  cloudwatch_logger = CloudWatchLogger.new({}, ENV['CLOUDWATCH_LOG_GROUP'])
  Rails.application.config.logger.extend(ActiveSupport::Logger.broadcast(cloudwatch_logger))
end
