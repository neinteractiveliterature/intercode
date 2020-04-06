class Mutations::SubmitOrder < Mutations::BaseMutation
  field :order, Types::OrderType, null: false

  argument :id, Integer, required: true
  argument :payment_mode, Types::PaymentModeType, required: true, camelize: false
  argument :stripe_token, String, required: false, camelize: false

  load_and_authorize_model_with_id Order, :id, :submit

  def resolve(**args)
    service = SubmitOrderService.new(
      order, payment_mode: args[:payment_mode], stripe_token: args[:stripe_token]
    )
    result = service.call

    if result.failure?
      err = result.exception || CivilService::ServiceFailure.new(service, result)
      raise GraphQL::ExecutionError, err.message if result.card_error
      raise err, err.message, err.backtrace
    end

    { order: order.reload }
  end
end
