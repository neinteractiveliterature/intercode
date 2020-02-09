class IntercodeSchema < GraphQL::Schema
  class NotAuthorizedError < GraphQL::ExecutionError
    attr_reader :current_user

    def self.from_error(error, message, **args)
      new(message, current_user: error.context[:current_user], **args)
    end

    def initialize(message, current_user:, **args)
      super(message, **args)
      @current_user = current_user
    end

    def message
      if current_user
        super
      else
        'Not logged in'
      end
    end

    def code
      if current_user
        'NOT_AUTHORIZED'
      else
        'NOT_AUTHENTICATED'
      end
    end

    def to_h
      super.merge({
        "extensions" => {
          "code" => code,
          "current_user_id": current_user&.id
        }
      })
    end
  end

  use GraphQL::Execution::Interpreter
  use GraphQL::Analysis::AST
  use GraphQL::Execution::Errors

  mutation(Types::MutationType)
  query(Types::QueryType)

  use GraphQL::Batch

  rescue_from ActiveRecord::RecordInvalid do |err, _obj, _args, _ctx, _field|
    raise GraphQL::ExecutionError.new(
      "Validation failed for #{err.record.class.name}: \
#{err.record.errors.full_messages.join(', ')}",
      extensions: {
        validationErrors: err.record.errors.as_json
      }
    )
  end

  rescue_from ActiveRecord::RecordNotFound do |_err, _obj, _args, _ctx, field|
    type_name = field.type.unwrap.graphql_name
    if type_name == 'Boolean'
      raise GraphQL::ExecutionError, "Record not found while evaluating #{field.name}"
    else
      raise GraphQL::ExecutionError, "#{field.type.unwrap.graphql_name} not found"
    end
  end

  rescue_from Liquid::SyntaxError do |err, _obj, _args, _ctx, _field|
    raise GraphQL::ExecutionError.new(
      err.message, extensions: { backtrace: err.backtrace }
    )
  end

  rescue_from CivilService::ServiceFailure do |err, _obj, _args, _ctx, _field|
    Rollbar.error(err)
    raise GraphQL::ExecutionError.new(
      err.result.errors.full_messages.join(', '), extensions: { backtrace: err.backtrace }
    )
  end

  # Catch-all for unhandled errors
  rescue_from StandardError do |err, _obj, _args, _ctx, _field|
    Rollbar.error(err)
    raise GraphQL::ExecutionError.new(
      err.message, extensions: { backtrace: err.backtrace }
    )
  end

  def self.resolve_type(_abstract_type, object, _context)
    case object
    when MailingListsPresenter then Types::MailingListsType
    end
  end

  def self.object_from_id(node_id, ctx)
  end

  def self.id_from_object(object, type, ctx)
  end

  def self.unauthorized_object(error)
    # Add a top-level error to the response instead of returning nil:
    raise NotAuthorizedError.from_error(
      error,
      "An object of type #{error.type.graphql_name} was hidden due to permissions"
    )
  end

  def self.unauthorized_field(error)
    # It should be safe to query for admin_notes even if you can't see them
    return nil if error.field.graphql_name == 'admin_notes'

    # Add a top-level error to the response instead of returning nil:
    raise NotAuthorizedError.from_error(
      error,
      "The field #{error.field.graphql_name} on an object of type #{error.type.graphql_name} \
was hidden due to permissions"
    )
  end
end

IntercodeSchema.graphql_definition
