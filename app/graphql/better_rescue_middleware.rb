class BetterRescueMiddleware
  attr_reader :rescue_table

  def initialize
    @rescue_table = []
  end

  def rescue_from(*error_classes, &block)
    base_classes = Set.new(rescue_table.map(&:first))
    error_classes.map do |error_class|
      next if base_classes.include?(error_class)
      rescue_table << [error_class, block]
    end
  end

  def remove_handler(*error_classes)
    remove_classes = Set.new(error_classes)
    rescue_table.reject! { |error_class| remove_classes.include?(error_class) }
  end

  def call(*)
    yield
  rescue StandardError => err
    Rails.logger.error "#{err.class.name} processing GraphQL query: #{err.message}"
    Rails.logger.error err.backtrace.join("\n")
    Rollbar.error(err)
    attempt_rescue(err)
  end

  private

  def attempt_rescue(err)
    handler = find_handler(err)
    return GraphQL::ExecutionError.new(err.message) unless handler

    message = handler.call(err)
    GraphQL::ExecutionError.new(message)
  end

  def find_handler(err)
    table_entry = rescue_table.find { |(base_class, _)| err.is_a?(base_class) }
    table_entry&.second
  end
end
