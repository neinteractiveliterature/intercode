if ENV['CLOUDWATCH_LOG_GROUP']
  # rubocop:disable Naming/ClassAndModuleCamelCase
  # rubocop:disable Lint/SuppressedException
  # Patch the CloudWatchLogger deliverer to not log messages about itself logging messages
  module CloudWatchLogger
    module Client
      class AWS_SDK
        class DeliveryThread < Thread
          def connect!(opts = {})
            # This is the only actually changed line: I added logger: nil
            args = { http_open_timeout: opts[:open_timeout], http_read_timeout: opts[:read_timeout], logger: nil }
            args[:region] = @opts[:region] if @opts[:region]
            args.merge(
              if @credentials.key?(:access_key_id)
                { access_key_id: @credentials[:access_key_id], secret_access_key: @credentials[:secret_access_key] }
              else
                {}
              end
            )

            @client = Aws::CloudWatchLogs::Client.new(args)
            begin
              @client.create_log_stream(log_group_name: @log_group_name, log_stream_name: @log_stream_name)
            rescue Aws::CloudWatchLogs::Errors::ResourceNotFoundException
              @client.create_log_group(log_group_name: @log_group_name)
              retry
            rescue Aws::CloudWatchLogs::Errors::ResourceAlreadyExistsException,
                   Aws::CloudWatchLogs::Errors::AccessDeniedException
            end
          end
        end
      end
    end
  end

  # rubocop:enable Naming/ClassAndModuleCamelCase
  # rubocop:enable Lint/SuppressedException

  Ahoy.logger = nil

  dyno_id = ENV['DYNO']
  dyno_type = dyno_id ? dyno_id.split('.').first : nil

  # Adapted from https://github.com/liefery-it-legacy/loggery-gem
  class ShoryukenJSONLogging
    class << self
      # Clients can provide their own error handler
      attr_accessor(:error_handler) { ->(e) { Rails.logger.error(e) } }
    end

    def call(_worker_instance, queue, _sqs_msg, body)
      metadata = build_metadata(queue, body)
      job_instance_name = "#{body['job_class']} (#{body['arguments']})"
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
      dyno_id = ENV['DYNO']
      dyno_type = dyno_id ? dyno_id.split('.').first : nil

      {
        jid: body['job_id'],
        thread_id: Thread.current.object_id.to_s(36),
        job_class: body['job_class'],
        arguments: body['arguments'].inspect,
        queue: queue,
        executions: body['executions'],
        dyno_type: dyno_type,
        dyno_id: dyno_id
      }
    end

    def log_job_start(body, job_instance_name, metadata)
      execution_delay = (Time.current - Time.zone.parse(body['enqueued_at']) if body['enqueued_at'])

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
    config.lograge.formatter = Lograge::Formatters::Json.new
    config.lograge.enabled = true
    config.lograge.base_controller_class = ['ActionController::Base']
    config.lograge.custom_payload do |controller|
      {
        host: controller.request.host,
        current_user_id: controller.current_user&.id,
        assumed_identity_from_profile_id:
          controller.respond_to?(:assumed_identity_from_profile) ? controller.assumed_identity_from_profile&.id : nil
      }
    end

    config.lograge.custom_options =
      lambda do |event|
        {
          request_time: Time.now,
          application: Rails.application.class.name.delete_suffix('::Application'),
          process_id: Process.pid,
          host: event.payload[:host],
          remote_ip: event.payload[:remote_ip],
          ip: event.payload[:ip],
          x_forwarded_for: event.payload[:x_forwarded_for],
          params: event.payload[:params],
          rails_env: Rails.env,
          exception: event.payload[:exception]&.first,
          request_id: event.payload[:headers]['action_dispatch.request_id'],
          current_user_id: event.payload[:current_user_id],
          assumed_identity_from_profile_id: event.payload[:assumed_identity_from_profile_id],
          dyno_type: dyno_type,
          dyno_id: dyno_id
        }.compact
      end
  end

  cloudwatch_logger =
    CloudWatchLogger.new(
      {},
      ENV['CLOUDWATCH_LOG_GROUP'],
      dyno_type || ENV['CLOUDWATCH_LOG_STREAM_NAME'] || 'intercode',
      { format: :json }
    )
  Rails.application.config.logger.extend(ActiveSupport::Logger.broadcast(cloudwatch_logger))
end
