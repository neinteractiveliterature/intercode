# frozen_string_literal: true
class Mutations::CancelOrder < Mutations::BaseMutation
  field :order, Types::OrderType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :skip_refund, Boolean, required: false, camelize: false

  load_and_authorize_model_with_id Order, :id, :cancel

  def resolve(skip_refund: false, **_args)
    CancelOrderService.new(order: order, whodunit: user_con_profile, skip_refund: skip_refund).call!

    { order: order }
  end
end
