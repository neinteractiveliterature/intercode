# frozen_string_literal: true
class Mutations::AddOrderEntryToCurrentPendingOrder < Mutations::BaseMutation
  field :order_entry, Types::OrderEntryType, null: false
  argument :order_entry, Types::OrderEntryInputType, required: true, camelize: false

  require_user_con_profile

  def resolve(order_entry:)
    product = convention.products.find(order_entry.transitional_product_id || order_entry.product_id)
    raise GraphQL::ExecutionError, "#{product.name} is not publicly available" unless product.available?

    order = current_pending_order
    order ||= user_con_profile.orders.create!(status: 'pending')

    new_order_entry =
      order
        .order_entries
        .find_or_initialize_by(
          product: product,
          product_variant_id: order_entry.transitional_product_variant_id || order_entry.product_variant_id
        ) { |entry| entry.quantity = 0 }
    new_order_entry.quantity += order_entry.quantity
    new_order_entry.save!

    { order_entry: new_order_entry }
  end
end
