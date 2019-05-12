class IntercodeSchema < GraphQL::Schema
  mutation(Types::MutationType)
  query(Types::QueryType)

  use GraphQL::Guard.new
  use GraphQL::Batch
  use GraphQL::Tracing::SkylightTracing, set_endpoint_name: true

  better_rescue_middleware = BetterRescueMiddleware.new
  better_rescue_middleware.rescue_from ActiveRecord::RecordInvalid do |err, _ctx|
    GraphQL::ExecutionError.new(
      "Validation failed for #{err.record.class.name}: \
#{err.record.errors.full_messages.join(', ')}",
      options: {
        validationErrors: err.record.errors.as_json
      }
    )
  end
  better_rescue_middleware.rescue_from CivilService::ServiceFailure do |err, _ctx|
    err.result.errors.full_messages.join(', ')
  end
  better_rescue_middleware.rescue_from GraphQL::Guard::NotAuthorizedError do |err, ctx|
    if ctx[:current_user]
      GraphQL::ExecutionError.new(
        "Unauthorized access: #{err.message}",
        extensions: {
          code: 'NOT_AUTHORIZED',
          current_user_id: ctx[:current_user]&.id
        }
      )
    else
      BetterRescueMiddleware::UnloggedError.new(
        "Not logged in: #{err.message}",
        extensions: {
          code: 'NOT_AUTHENTICATED'
        }
      )
    end
  end
  better_rescue_middleware.suppress_logs(
    ActiveRecord::RecordNotFound,
    ActiveRecord::RecordInvalid,
    Liquid::SyntaxError
  )
  middleware better_rescue_middleware

  def self.resolve_type(_abstract_type, object, _context)
    case object
    when MailingListsPresenter then Types::MailingListsType
    end
  end

  def self.object_from_id(node_id, ctx)
  end

  def self.id_from_object(object, type, ctx)
  end
end
