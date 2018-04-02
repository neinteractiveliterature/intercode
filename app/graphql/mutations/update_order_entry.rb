Mutations::UpdateOrderEntry = GraphQL::Relay::Mutation.define do
  name 'UpdateOrderEntry'
  return_field :order_entry, Types::OrderEntryType

  input_field :id, !types.Int
  input_field :order_entry, !Types::OrderEntryInputType

  resolve ->(_obj, args, _ctx) {
    order_entry = OrderEntry.find(args[:id])
    order_entry.update!(args[:order_entry].to_h)

    { order_entry: order_entry }
  }
end
