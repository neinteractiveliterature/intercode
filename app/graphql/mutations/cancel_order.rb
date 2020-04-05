class Mutations::CancelOrder < Mutations::BaseMutation
  field :order, Types::OrderType, null: false

  argument :id, Integer, required: true
  argument :skip_refund, Boolean, required: false, camelize: false

  load_and_authorize_model_with_id Order, :id, :cancel

  def resolve(skip_refund: false, **_args)
    CancelOrderService.new(order: order, whodunit: user_con_profile, skip_refund: skip_refund).call!

    { order: order }
  end
end
