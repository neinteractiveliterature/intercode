if ENV["RAILS_LOG_TO_STDOUT"].present?
  Rails.application.configure do |config|
    config.logger = ActiveSupport::TaggedLogging.new(Logger.new(STDOUT))
  end
end