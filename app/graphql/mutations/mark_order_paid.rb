Mutations::MarkOrderPaid = GraphQL::Relay::Mutation.define do
  name 'MarkOrderPaid'
  return_field :order, Types::OrderType

  input_field :id, !types.Int

  resolve ->(_obj, args, ctx) {
    order = ctx[:convention].orders.find(args[:id])
    raise "Order is #{order.status}" unless order.status == 'unpaid'

    order.update!(
      status: 'paid',
      payment_note: "Marked as paid by #{ctx[:user_con_profile].name_without_nickname} \
on #{Time.now.in_time_zone(ctx[:convention].timezone).strftime('%B %-d, %Y at %l:%M%P')}"
    )

    { order: order }
  }
end
