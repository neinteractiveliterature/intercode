IntercodeSchema = GraphQL::Schema.define do
  mutation(Types::MutationType)
  query(Types::QueryType)

  use GraphQL::Guard.new
  use GraphQL::Batch

  better_rescue_middleware = BetterRescueMiddleware.new
  better_rescue_middleware.rescue_from ActiveRecord::RecordInvalid do |err|
    "Invalid input for #{err.record.class.name}: #{err.record.errors.full_messages.join(', ')}"
  end
  better_rescue_middleware.rescue_from ApplicationService::ServiceFailure do |err|
    err.result.errors.full_messages.join(', ')
  end
  middleware better_rescue_middleware
end
