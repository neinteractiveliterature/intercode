# frozen_string_literal: true
class Mutations::CreateOrderEntry < Mutations::BaseMutation
  include OrderEntryInputs

  field :order_entry, Types::OrderEntryType, null: false

  argument :order_id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false,
           camelize: false
  argument :transitional_order_id, ID, required: false, camelize: true
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
