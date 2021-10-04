# frozen_string_literal: true
class Mutations::CancelOrder < Mutations::BaseMutation
  field :order, Types::OrderType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :skip_refund, Boolean, required: false, camelize: false

  load_and_authorize_model_with_id Order, :id, :cancel

  def resolve(skip_refund: false, **_args)
    CancelOrderService.new(order: order, whodunit: user_con_profile, skip_refund: skip_refund).call!

    { order: order }
  end
end
