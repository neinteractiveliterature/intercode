# frozen_string_literal: true
class Mutations::UpdateOrder < Mutations::BaseMutation
  field :order, Types::OrderType, null: false

  argument :id, ID, required: false
  argument :order, Types::OrderInputType, required: true

  load_and_authorize_model_with_id Order, :id, :update

  def resolve(**args)
    order_attrs = args[:order].to_h
    if order_attrs[:payment_amount]
      order_attrs[:payment_amount] = MoneyHelper.coerce_money_input(order_attrs[:payment_amount])
    end
    order.update!(order_attrs)

    { order: order }
  end
end
