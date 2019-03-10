Mutations::SubmitOrder = GraphQL::Relay::Mutation.define do
  name 'SubmitOrder'
  return_field :order, Types::OrderType

  input_field :id, !types.Int
  input_field :payment_mode, Types::PaymentModeType.to_non_null_type
  input_field :stripe_token, types.String

  resolve ->(_obj, args, _ctx) do
    order = Order.find(args[:id])

    if args[:payment_mode] == 'now'
      order.update!(submitted_at: Time.now)

      service = PayOrderService.new(order, args[:stripe_token])
      result = service.call

      if result.failure?
        err = CivilService::ServiceFailure.new(service, result)
        raise BetterRescueMiddleware::UnloggedError, err.message if result.card_error
        raise err
      end
    else
      order.update!(status: 'unpaid', submitted_at: Time.now)
    end

    { order: order.reload }
  end
end
