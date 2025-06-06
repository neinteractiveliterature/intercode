# frozen_string_literal: true
class Mutations::CancelOrder < Mutations::BaseMutation
  field :order, Types::OrderType, null: false

  argument :id, ID, required: false
  argument :skip_refund, Boolean, required: false, camelize: false

  load_and_authorize_model_with_id Order, :id, :cancel

  def resolve(skip_refund: false, **_args)
    CancelOrderService.new(order:, whodunit: current_user, skip_refund:).call!

    { order: }
  end
end
