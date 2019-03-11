class Mutations::MarkOrderPaid < Mutations::BaseMutation
  field :order, Types::OrderType, null: false

  argument :id, Integer, required: true

  def resolve(**args)
    order = convention.orders.find(args[:id])
    raise "Order is #{order.status}" unless order.status == 'unpaid'

    order.update!(
      status: 'paid',
      payment_note: "Marked as paid by #{user_con_profile.name_without_nickname} \
on #{Time.now.in_time_zone(convention.timezone).strftime('%B %-d, %Y at %l:%M%P')}"
    )

    { order: order }
  end
end
