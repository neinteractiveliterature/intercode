Shoryuken.configure_server do |config|
  # Replace Rails logger so messages are logged wherever Shoryuken is logging
  # Note: this entire block is only run by the processor, so we don't overwrite
  #       the logger when the app is running as usual.

  Rails.logger = Shoryuken::Logging.logger
  Rails.logger.level = Rails.application.config.log_level

  Shoryuken.active_job_queue_name_prefixing = true
  Shoryuken.sqs_client_receive_message_opts[:default] = { wait_time_seconds: 20 }
  Shoryuken.sqs_client_receive_message_opts[:mailers] = { wait_time_seconds: 20 }
  Shoryuken.sqs_client_receive_message_opts[:ahoy] = { wait_time_seconds: 20 }

  # Don't spam the logs
  config.sqs_client = Aws::SQS::Client.new(log_level: :info)

  # config.server_middleware do |chain|
  #  chain.add Shoryuken::MyMiddleware
  # end

  # For dynamically adding queues prefixed by Rails.env
  # %w(queue1 queue2).each do |name|
  #   Shoryuken.add_queue("#{Rails.env}_#{name}", 1)
  # end
end
