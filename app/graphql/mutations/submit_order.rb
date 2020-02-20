class Mutations::SubmitOrder < Mutations::BaseMutation
  field :order, Types::OrderType, null: false

  argument :id, Integer, required: true
  argument :payment_mode, Types::PaymentModeType, required: true, camelize: false
  argument :stripe_token, String, required: false, camelize: false

  load_and_authorize_model_with_id Order, :id, :submit

  def resolve(**args)
    if args[:payment_mode] == 'now'
      order.update!(submitted_at: Time.zone.now)

      service = PayOrderService.new(order, args[:stripe_token])
      result = service.call

      if result.failure?
        err = CivilService::ServiceFailure.new(service, result)
        raise GraphQL::ExecutionError, err.message if result.card_error
        raise err
      end
    else
      order.update!(status: 'unpaid', submitted_at: Time.zone.now)
    end

    { order: order.reload }
  end
end
