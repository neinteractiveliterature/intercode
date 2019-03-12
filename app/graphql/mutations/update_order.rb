class Mutations::UpdateOrder < Mutations::BaseMutation
  field :order, Types::OrderType, null: false

  argument :id, Integer, required: true
  argument :order, Types::OrderInputType, required: true

  def resolve(**args)
    order = Order.find(args[:id])
    order.update!(args[:order].to_h)

    { order: order }
  end
end
