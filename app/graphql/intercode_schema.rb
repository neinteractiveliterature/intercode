IntercodeSchema = GraphQL::Schema.define do
  mutation(Types::MutationType)
  query(Types::QueryType)

  use GraphQL::Guard.new
  use GraphQL::Batch

  better_rescue_middleware = BetterRescueMiddleware.new
  better_rescue_middleware.rescue_from ActiveRecord::RecordInvalid do |err|
    GraphQL::ExecutionError.new(
      "Invalid input for #{err.record.class.name}: #{err.record.errors.full_messages.join(', ')}",
      options: {
        validationErrors: err.record.errors.as_json(full_messages: true)
      }
    )
  end
  better_rescue_middleware.rescue_from ApplicationService::ServiceFailure do |err|
    err.result.errors.full_messages.join(', ')
  end
  better_rescue_middleware.rescue_from GraphQL::Guard::NotAuthorizedError do |err|
    "Unauthorized access: #{err.message}"
  end
  middleware better_rescue_middleware
end
