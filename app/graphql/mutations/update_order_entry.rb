class Mutations::UpdateOrderEntry < Mutations::BaseMutation
  field :order_entry, Types::OrderEntryType, null: false

  argument :id, Integer, required: true
  argument :order_entry, Types::OrderEntryInputType, required: true, camelize: false

  def resolve(**args)
    order_entry = OrderEntry.find(args[:id])
    order_entry.update!(args[:order_entry].to_h)

    { order_entry: order_entry }
  end
end
