class MutationErrorHandler
  attr_reader :resolve_func

  def initialize(resolve_func)
    @resolve_func = resolve_func
  end

  def call(obj, args, ctx)
    resolve_func.call(obj, args, ctx)
  rescue ActiveRecord::RecordInvalid => err
    GraphQL::ExecutionError.new(
      "Invalid input for #{err.record.class.name}: #{err.record.errors.full_messages.join(', ')}"
    )
  rescue ApplicationService::ServiceFailure => err
    GraphQL::ExecutionError.new(err.result.errors.full_messages.join(', '))
  end
end
