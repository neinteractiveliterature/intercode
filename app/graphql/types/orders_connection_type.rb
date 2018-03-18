Types::OrdersConnectionType = Types::OrderType.define_connection do
  name 'OrdersConnection'

  field :totalCount, !types.Int do
    resolve ->(obj, _args, _ctx) { obj.nodes.count }
  end
end
