# frozen_string_literal: true
class Mutations::SubmitOrder < Mutations::BaseMutation
  description "Submit an order.  This triggers payment, unless the order is free."

  field :order, Types::OrderType, null: false, description: "The order after successful submission."

  argument :id, ID, required: false, description: "The ID of the order to submit."
  argument :payment_intent_id, String, required: false, camelize: false do
    description "The ID of the Stripe PaymentIntent to use for payment, if applicable."
  end
  argument :payment_mode, Types::PaymentModeType, required: true, camelize: false do
    description "The payment mode to use for submitting this order."
  end

  load_and_authorize_model_with_id Order, :id, :submit

  def resolve(**args)
    service =
      SubmitOrderService.new(order, payment_mode: args[:payment_mode], payment_intent_id: args[:payment_intent_id])
    result = service.call

    if result.failure?
      err = result.exception || CivilService::ServiceFailure.new(service, result)
      raise GraphQL::ExecutionError, err.message if result.card_error
      raise err, err.message, err.backtrace
    end

    { order: order.reload }
  end
end
