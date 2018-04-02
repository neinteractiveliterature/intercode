Mutations::CancelOrder = GraphQL::Relay::Mutation.define do
  name 'CancelOrder'
  return_field :order, Types::OrderType

  input_field :id, !types.Int

  resolve ->(_obj, args, ctx) {
    order = ctx[:convention].orders.find(args[:id])
    raise 'Order is already cancelled' if order.status == 'cancelled'

    refund = Stripe::Refund.create(charge: order.charge_id) if order.charge_id

    action = 'Cancelled '
    if order.status == 'paid'
      action << (refund ? 'with refund' : 'without refund')
    else
      action << 'unpaid'
    end

    order.update!(
      status: 'cancelled',
      payment_note: [
        "#{action} by #{ctx[:user_con_profile].name_without_nickname} \
on #{Time.now.in_time_zone(ctx[:convention].timezone).strftime('%B %-d, %Y at %l:%M%P')}",
        order.payment_note.presence
      ].compact.join('; ')
    )
    OrdersMailer.cancelled(order, refund&.id).deliver_later

    { order: order }
  }
end
