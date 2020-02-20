class Mutations::CancelOrder < Mutations::BaseMutation
  field :order, Types::OrderType, null: false

  argument :id, Integer, required: true

  load_and_authorize_model_with_id Order, :id, :cancel

  def resolve(**_args)
    raise 'Order is already cancelled' if order.status == 'cancelled'

    refund = nil
    if order.charge_id
      charge = Stripe::Charge.retrieve(order.charge_id, api_key: convention.stripe_secret_key)

      if charge.refunded
        refund = charge.refunds.first
      else
        refund = Stripe::Refund.create(
          { charge: order.charge_id },
          api_key: convention.stripe_secret_key
        )
      end
    end

    action = 'Cancelled '
    if order.status == 'paid'
      action << (refund ? 'with refund' : 'without refund')
    else
      action << 'unpaid'
    end

    order.update!(
      status: 'cancelled',
      payment_note: [
        "#{action} by #{user_con_profile.name_without_nickname} \
on #{Time.now.in_time_zone(convention.timezone).strftime('%B %-d, %Y at %l:%M%P')}",
        order.payment_note.presence
      ].compact.join('; ')
    )
    Orders::CancelledNotifier.new(order: order, refund_id: refund&.id).deliver_later

    { order: order }
  end
end
