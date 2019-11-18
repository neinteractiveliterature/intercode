if ENV['GRAPHQL_DEBUG']
  Rails.logger.info 'Enabling GraphQL debug logging'
  %w[execute_field execute_field_lazy].each do |event|
    ActiveSupport::Notifications.subscribe("graphql.#{event}") do |name, start, finish, _id, payload|
      time_ms = ((finish - start) * 1000).round
      if time_ms > 0
        field = payload[:field]
        field_name = "#{field.owner.graphql_name}.#{field.graphql_name}"
        field_desc = if payload[:arguments].present?
          "#{field_name}#{payload[:arguments].to_json}"
        else
          field_name
        end
        Rails.logger.debug("#{name} [#{time_ms}ms] #{field_desc}")
      end
    end
  end
end
