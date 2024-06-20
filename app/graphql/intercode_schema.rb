# frozen_string_literal: true
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
        "Not logged in"
      end
    end

    def code
      current_user ? "NOT_AUTHORIZED" : "NOT_AUTHENTICATED"
    end

    def to_h
      super.merge("extensions" => { "code" => code, "current_user_id" => current_user&.id })
    end
  end

  class DeprecatedUsageAnalyzer < GraphQL::Analysis::AST::Analyzer
    def initialize(query_or_multiplex)
      super
      @context = query_or_multiplex.context
      @deprecated_usages = Set.new
    end

    def on_leave_field(node, _parent, visitor)
      operation_name = visitor.query.operation_name
      check_deprecated_field_usage(node, visitor, operation_name)

      argument_names = node.arguments.map(&:name)
      argument_names.each do |argument_name|
        check_deprecated_argument_usage(node, visitor, argument_name, operation_name)
      end
    end

    def check_deprecated_field_usage(node, visitor, operation_name)
      return if visitor.field_definition.deprecation_reason.blank?

      @deprecated_usages.add(
        {
          operation_name: operation_name,
          graphql_type: visitor.field_definition.owner.graphql_name,
          field_name: node.name,
          argument_name: nil
        }
      )
    end

    def check_deprecated_argument_usage(node, visitor, argument_name, operation_name)
      argument = visitor.field_definition.arguments.symbolize_keys[argument_name.to_sym]
      return if argument.deprecation_reason.blank?

      @deprecated_usages.add(
        {
          operation_name: operation_name,
          graphql_type: visitor.field_definition.owner.graphql_name,
          field_name: node.name,
          argument_name: argument_name
        }
      )
    end

    def result
      return if @deprecated_usages.blank?

      client_address = @context[:controller]&.request&.ip
      user_agent = @context[:controller]&.request&.user_agent

      @deprecated_usages.each do |usage|
        DeprecatedGraphQlUsage.create(**usage, client_address: client_address, user_agent: user_agent)
      end
      Rails.logger.warn("Deprecated GraphQL fields/arguments used: #{@deprecated_usages.as_json.inspect}")
    end
  end

  trace_with GraphQL::Tracing::SentryTrace if Sentry.get_current_client

  mutation(Types::MutationType)
  query(Types::QueryType)

  query_analyzer DeprecatedUsageAnalyzer

  use GraphQL::Dataloader

  rescue_from ActiveRecord::RecordInvalid do |err, _obj, _args, _ctx, _field|
    raise GraphQL::ExecutionError.new(
            "Validation failed for #{err.record.class.name}: \
#{err.record.errors.full_messages.join(", ")}",
            extensions: {
              validationErrors: err.record.errors.as_json,
              code: "RECORD_INVALID"
            }
          )
  end

  rescue_from ActiveRecord::RecordNotFound do |_err, _obj, _args, _ctx, field|
    type_name = field.type.unwrap.graphql_name

    if type_name == "Boolean"
      raise GraphQL::ExecutionError.new(
              "Record not found while evaluating #{field.name}",
              extensions: {
                code: "NOT_FOUND"
              }
            )
    end

    raise GraphQL::ExecutionError.new("#{field.type.unwrap.graphql_name} not found", extensions: { code: "NOT_FOUND" })
  end

  rescue_from Liquid::SyntaxError do |err, _obj, _args, _ctx, _field|
    IntercodeSchema.log_error(err)
    raise GraphQL::ExecutionError.new(err.message, extensions: { backtrace: err.backtrace })
  end

  rescue_from CivilService::ServiceFailure do |err, _obj, _args, _ctx, _field|
    Rollbar.error(err)
    IntercodeSchema.log_error(err)
    raise GraphQL::ExecutionError.new(
            err.result.errors.full_messages.join(", "),
            extensions: {
              backtrace: err.backtrace
            }
          )
  end

  # Catch-all for unhandled errors
  rescue_from StandardError do |err, _obj, _args, _ctx, _field|
    Rollbar.error(err)
    IntercodeSchema.log_error(err)
    raise GraphQL::ExecutionError.new(err.message, extensions: { backtrace: err.backtrace })
  end

  def self.log_error(err)
    backtrace = Rails.backtrace_cleaner.clean(err.backtrace)
    Rails.logger.error([err.message, *backtrace].join($INPUT_RECORD_SEPARATOR))
  end

  def self.resolve_type(_abstract_type, object, _context)
    case object
    when MailingListsPresenter
      Types::MailingListsType
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
    return nil if error.field.graphql_name == "admin_notes"

    # Add a top-level error to the response instead of returning nil:
    raise NotAuthorizedError.from_error(
            error,
            "The field #{error.field.graphql_name} on an object of type #{error.type.graphql_name} \
was hidden due to permissions"
          )
  end
end
