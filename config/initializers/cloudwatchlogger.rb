if ENV["CLOUDWATCH_LOG_GROUP"]
  Ahoy.logger = nil

  dyno_id = ENV.fetch("DYNO", nil)
  dyno_type = dyno_id&.split(".")&.first

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

  ::Shoryuken.configure_server do |config|
    config.server_middleware { |chain| chain.add ShoryukenJSONLogging }
    config.sqs_client = Aws::SQS::Client.new(logger: nil)
  end

  Rails.application.configure do
    config.lograge.formatter = Lograge::Formatters::Raw.new
    config.lograge.enabled = true
    config.lograge.base_controller_class = ["ActionController::Base"]
    config.lograge.custom_payload do |controller|
      {
        host: controller.request.host,
        current_user_id: controller.current_user&.id,
        assumed_identity_from_profile_id:
          controller.respond_to?(:assumed_identity_from_profile) ? controller.assumed_identity_from_profile&.id : nil,
        remote_ip: controller.request.remote_ip,
        ip: controller.request.ip,
        x_forwarded_for: controller.request.headers["X-Forwarded-For"],
        user_agent: controller.request.headers["User-Agent"]
      }
    end

    config.lograge.custom_options =
      lambda do |event|
        gc_stat = GC.stat
        {
          request_time: Time.now,
          application: Rails.application.class.name.delete_suffix("::Application"),
          process_id: Process.pid,
          host: event.payload[:host],
          remote_ip: event.payload[:remote_ip],
          user_agent: event.payload[:user_agent],
          ip: event.payload[:ip],
          x_forwarded_for: event.payload[:x_forwarded_for],
          params: event.payload[:params],
          rails_env: Rails.env,
          exception: event.payload[:exception]&.first,
          request_id: event.payload[:headers]["action_dispatch.request_id"],
          current_user_id: event.payload[:current_user_id],
          assumed_identity_from_profile_id: event.payload[:assumed_identity_from_profile_id],
          dyno_type: dyno_type,
          dyno_id: dyno_id,
          gc: gc_stat
        }.compact
      end
  end

  # Don't log about every log message attempt
  logger_logger = Logger.new($stderr)
  logger_logger.level = Logger::WARN

  cloudwatch_logger =
    CloudWatchLogger.new(
      {},
      ENV["CLOUDWATCH_LOG_GROUP"],
      dyno_type || ENV["CLOUDWATCH_LOG_STREAM_NAME"] || "intercode",
      { format: :json, logger: logger_logger }
    )
  Rails.application.config.logger.extend(ActiveSupport::Logger.broadcast(cloudwatch_logger))
end
