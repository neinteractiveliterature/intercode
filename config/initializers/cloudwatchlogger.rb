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

  Rails.application.configure do
    config.lograge.formatter = Lograge::Formatters::Json.new
    config.lograge.enabled = true
    config.lograge.base_controller_class = ['ActionController::Base']
    config.lograge.custom_payload do |controller|
      {
        current_user_id: controller.current_user&.id,
        assumed_identity_from_profile_id:
          controller.respond_to?(:assumed_identity_from_profile) ? controller.assumed_identity_from_profile&.id : nil
      }
    end

    config.lograge.custom_options =
      lambda do |event|
        dyno_id = ENV['DYNO']
        dyno_type = dyno_id ? dyno_id.split('.').first : nil

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
      ENV['CLOUDWATCH_LOG_STREAM_NAME'] || 'intercode',
      { format: :json }
    )
  Rails.application.config.logger.extend(ActiveSupport::Logger.broadcast(cloudwatch_logger))
end
