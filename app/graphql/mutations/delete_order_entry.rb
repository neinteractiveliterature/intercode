Mutations::DeleteOrderEntry = GraphQL::Relay::Mutation.define do
  name 'DeleteOrderEntry'
  return_field :order_entry, Types::OrderEntryType

  input_field :id, !types.Int

  resolve ->(_obj, args, _ctx) {
    order_entry = OrderEntry.find(args[:id])
    order_entry.destroy!
    { order_entry: order_entry }
  }
end
