class Types::OrdersConnectionType < GraphQL::Types::Relay::BaseConnection
  edge_type Types::OrderType.edge_type
  field :total_count, Integer, null: false

  def total_count
    object.nodes.count
  end
end
