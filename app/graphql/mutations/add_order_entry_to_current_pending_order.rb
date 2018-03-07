Mutations::AddOrderEntryToCurrentPendingOrder = GraphQL::Relay::Mutation.define do
  name 'AddOrderEntryToCurrentPendingOrder'
  return_field :order_entry, Types::OrderEntryType

  input_field :order_entry, !Types::OrderEntryInputType

  resolve ->(_obj, args, ctx) {
    order = ctx[:current_pending_order]
    order ||= ctx[:user_con_profile].orders.create!(status: 'pending')

    order_entry = order.order_entries.find_or_initialize_by(
      product_id: args[:order_entry][:product_id],
      product_variant_id: args[:order_entry][:product_variant_id]
    ) do |entry|
      entry.quantity = 0
    end
    order_entry.quantity += args[:order_entry][:quantity]
    order_entry.save!

    { order_entry: order_entry }
  }
end
