# Adapted from https://github.com/liefery-it-legacy/loggery-gem
class ShoryukenJSONLogging
  class << self
    # Clients can provide their own error handler
    attr_accessor(:error_handler) { ->(e) { Rails.logger.error(e) } }
  end

  def call(_worker_instance, queue, _sqs_msg, body)
    metadata = build_metadata(queue, body)
    job_instance_name = "#{body["job_class"]} (#{body["arguments"]})"
    log_job_start(body, job_instance_name, metadata)

    log_job_runtime(:shoryuken_job, job_instance_name, metadata) do
      yield
    rescue StandardError => e
      # Log exceptions here, otherwise they won't have the metadata available anymore by
      # the time they reach the Shoryuken default error handler.
      self.class.error_handler&.call(e)
      raise e
    end
  end

  private

  def build_metadata(queue, body)
    dyno_id = ENV.fetch("DYNO", nil)
    dyno_type = dyno_id&.split(".")&.first

    {
      jid: body["job_id"],
      thread_id: Thread.current.object_id.to_s(36),
      job_class: body["job_class"],
      arguments: body["arguments"].inspect,
      queue: queue,
      executions: body["executions"],
      dyno_type: dyno_type,
      dyno_id: dyno_id
    }
  end

  def log_job_start(body, job_instance_name, metadata)
    execution_delay = (Time.current - Time.zone.parse(body["enqueued_at"]) if body["enqueued_at"])

    Rails.logger.info(
      **metadata,
      event_type: :shoryuken_job_started,
      message: "Job type shoryuken_job - #{job_instance_name} started",
      execution_delay: execution_delay
    )
  end

  def log_job_runtime(job_type, job_instance_name, metadata)
    job_name = "Job type #{job_type} - #{job_instance_name}"

    begin
      start_time = Time.current
      yield if block_given?
    ensure
      end_time = Time.current
      duration = end_time - start_time

      Rails.logger.info(
        **metadata,
        event_type: :"#{job_type}_finished",
        message: "#{job_name} finished",
        duration: duration
      )
    end
  end
end

class ErrorReporter
  def call(_worker_instance, queue, _sqs_msg, body)
    yield
  rescue StandardError => e
    ErrorReporting.error(e, tags: { job: body["job_class"], queue: }, message: body)
  end
end

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
  Shoryuken.sqs_client_receive_message_opts[:cloudwatch_scheduler] = { wait_time_seconds: 20 }

  config.server_middleware do |chain|
    chain.add ShoryukenJSONLogging if ENV["JSON_LOGGING"]
    chain.add SentryReporter
  end

  # Don't spam the logs.  Counterintuitively this is telling AWS SDK what level to send its logs at, not what level to
  # show logs at least
  Aws.config.update(log_level: :debug)

  # config.server_middleware do |chain|
  #  chain.add Shoryuken::MyMiddleware
  # end

  # For dynamically adding queues prefixed by Rails.env
  # %w(queue1 queue2).each do |name|
  #   Shoryuken.add_queue("#{Rails.env}_#{name}", 1)
  # end
end
