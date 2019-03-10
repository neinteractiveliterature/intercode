class Mutations::AddOrderEntryToCurrentPendingOrder < Mutations::BaseMutation
  field :order_entry, Types::OrderEntryType, null: false
  argument :order_entry, Types::OrderEntryInputType, required: true, camelize: false

  def resolve(order_entry:)
    order = current_pending_order
    order ||= user_con_profile.orders.create!(status: 'pending')

    new_order_entry = order.order_entries.find_or_initialize_by(
      product_id: order_entry[:product_id],
      product_variant_id: order_entry[:product_variant_id]
    ) do |entry|
      entry.quantity = 0
    end
    new_order_entry.quantity += order_entry[:quantity]
    new_order_entry.save!

    { order_entry: new_order_entry }
  end
end
