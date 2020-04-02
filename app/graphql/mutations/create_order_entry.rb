class Mutations::CreateOrderEntry < Mutations::BaseMutation
  include OrderEntryInputs

  field :order_entry, Types::OrderEntryType, null: false

  argument :order_id, Integer, required: true, camelize: false
  argument :order_entry, Types::OrderEntryInputType, required: true, camelize: false

  attr_reader :order_entry

  def authorized?(order_id:, **_args)
    order = Order.find(order_id)
    @order_entry = order.order_entries.new
    self.class.check_authorization(policy(@order_entry), :create)
  end

  def resolve(**args)
    order_entry.assign_attributes(process_order_entry_input(args[:order_entry], order_entry))
    order_entry.save!

    { order_entry: order_entry }
  end
end
