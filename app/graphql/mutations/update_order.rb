class Mutations::UpdateOrder < Mutations::BaseMutation
  field :order, Types::OrderType, null: false

  argument :id, Integer, required: true
  argument :order, Types::OrderInputType, required: true

  load_and_authorize_model_with_id Order, :id, :update

  def resolve(**args)
    order.update!(args[:order].to_h)

    { order: order }
  end
end
