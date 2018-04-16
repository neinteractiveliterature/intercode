class IntercodeSchema < GraphQL::Schema
  mutation(Types::MutationType)
  query(Types::QueryType)

  use GraphQL::Guard.new
  use GraphQL::Batch
  use GraphQL::Tracing::SkylightTracing

  better_rescue_middleware = BetterRescueMiddleware.new
  better_rescue_middleware.rescue_from ActiveRecord::RecordInvalid do |err|
    GraphQL::ExecutionError.new(
      "Validation failed for #{err.record.class.name}: \
#{err.record.errors.full_messages.join(', ')}",
      options: {
        validationErrors: err.record.errors.as_json
      }
    )
  end
  better_rescue_middleware.rescue_from ApplicationService::ServiceFailure do |err|
    err.result.errors.full_messages.join(', ')
  end
  better_rescue_middleware.rescue_from GraphQL::Guard::NotAuthorizedError do |err|
    "Unauthorized access: #{err.message}"
  end
  middleware << better_rescue_middleware
end
