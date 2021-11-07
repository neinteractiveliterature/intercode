# frozen_string_literal: true
class Mutations::SubmitOrder < Mutations::BaseMutation
  field :order, Types::OrderType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :payment_mode, Types::PaymentModeType, required: true, camelize: false
  argument :stripe_token, String, required: false, camelize: false
  argument :payment_intent_id, String, required: false, camelize: false

  load_and_authorize_model_with_id Order, :id, :submit

  def resolve(**args)
    service =
      SubmitOrderService.new(
        order,
        payment_mode: args[:payment_mode],
        stripe_token: args[:stripe_token],
        payment_intent_id: args[:payment_intent_id]
      )
    result = service.call

    if result.failure?
      err = result.exception || CivilService::ServiceFailure.new(service, result)
      raise GraphQL::ExecutionError, err.message if result.card_error
      raise err, err.message, err.backtrace
    end

    { order: order.reload }
  end
end
