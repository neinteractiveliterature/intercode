# frozen_string_literal: true
class Mutations::UpdateOrder < Mutations::BaseMutation
  field :order, Types::OrderType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true
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
