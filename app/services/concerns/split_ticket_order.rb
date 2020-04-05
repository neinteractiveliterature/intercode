module SplitTicketOrder
  def split_ticket_to_new_order(ticket, operation_name)
    order_entry = ticket.order_entry
    order = order_entry.order

    new_order = ticket.user_con_profile.orders.create!(
      status: order.status,
      payment_amount: [order_entry.price_per_item, order.payment_amount].min,
      payment_note: "Split from order ##{order.id} in #{operation_name}; #{order.payment_note}",
      charge_id: order.charge_id,
      submitted_at: order.submitted_at,
      paid_at: order.paid_at
    )

    new_order_entry = new_order.order_entries.create!(
      quantity: 1,
      price_per_item: order_entry.price_per_item,
      product: order_entry.product,
      product_variant: order_entry.product_variant
    )

    ticket.update!(order_entry: new_order_entry)

    if order_entry.quantity == 1
      order_entry.destroy!
    else
      order_entry.decrement!(:quantity)
    end

    order.update!(
      payment_amount_cents: [order.payment_amount_cents - new_order.payment_amount_cents, 0].max
    )
  end
end
