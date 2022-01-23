if ENV['CLOUDWATCH_LOG_GROUP']
  # rubocop:disable Naming/ClassAndModuleCamelCase
  # rubocop:disable Lint/SuppressedException
  # Patch the CloudWatchLogger deliverer to not log messages about itself logging messages
  module CloudWatchLogger
    module Client
      class AWS_SDK
        class DeliveryThread < Thread
          def connect!(opts = {})
            # This is the only actually changed line: I added log_level: :warn
            args = { http_open_timeout: opts[:open_timeout], http_read_timeout: opts[:read_timeout], log_level: :warn }
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

  cloudwatch_logger =
    CloudWatchLogger.new(
      {},
      ENV['CLOUDWATCH_LOG_GROUP'],
      ENV['DYNO'] || ENV['CLOUDWATCH_LOG_STREAM_NAME'] || 'intercode'
    )
  Rails.application.config.logger.extend(ActiveSupport::Logger.broadcast(cloudwatch_logger))
end
