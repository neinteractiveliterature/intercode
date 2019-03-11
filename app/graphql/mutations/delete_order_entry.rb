class Mutations::DeleteOrderEntry < Mutations::BaseMutation
  field :order_entry, Types::OrderEntryType, null: false

  argument :id, Integer, required: true

  def resolve(**args)
    order_entry = OrderEntry.find(args[:id])
    order_entry.destroy!
    { order_entry: order_entry }
  end
end
