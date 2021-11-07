# frozen_string_literal: true
class Mutations::CreateOrderEntry < Mutations::BaseMutation
  include OrderEntryInputs

  field :order_entry, Types::OrderEntryType, null: false

  argument :transitional_order_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the orderId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :order_id, ID, required: false, camelize: true
  argument :order_entry, Types::OrderEntryInputType, required: true, camelize: false

  attr_reader :order_entry

  def authorized?(order_id: nil, transitional_order_id: nil, **_args)
    order = Order.find(transitional_order_id || order_id)
    @order_entry = order.order_entries.new
    self.class.check_authorization(policy(@order_entry), :create)
  end

  def resolve(**args)
    order_entry.assign_attributes(process_order_entry_input(args[:order_entry], order_entry))
    order_entry.save!

    { order_entry: order_entry }
  end
end
