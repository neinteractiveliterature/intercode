Mutations::UpdateOrder = GraphQL::Relay::Mutation.define do
  name 'UpdateOrder'
  return_field :order, Types::OrderType

  input_field :id, !types.Int
  input_field :order, !Types::OrderInputType

  resolve ->(_obj, args, _ctx) {
    order = Order.find(args[:id])
    order.update!(args[:order].to_h)

    { order: order }
  }
end
