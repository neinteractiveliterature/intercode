Types::OrdersConnectionType = Types::OrderType.define_connection do
  name 'OrdersConnection'

  field :total_count, Integer, null: false

  def total_count
    @object.nodes.count
  end
end
