Mutations::SubmitOrder = GraphQL::Relay::Mutation.define do
  name 'SubmitOrder'
  return_field :order, Types::OrderType

  input_field :id, !types.Int
  input_field :payment_mode, !Types::PaymentModeType
  input_field :stripe_token, types.String

  resolve ->(_obj, args, _ctx) do
    order = Order.find(args[:id])

    if args[:payment_mode] == 'now'
      PayOrderService.new(
        order,
        args[:stripe_token]
      ).call!
    else
      order.update!(status: 'unpaid')
    end

    { order: order.reload }
  end
end
