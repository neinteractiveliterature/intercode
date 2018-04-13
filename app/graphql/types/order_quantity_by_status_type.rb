Types::OrderQuantityByStatusType = GraphQL::ObjectType.define do
  name 'OrderQuantityByStatus'
  field :status, !types.String, hash_key: :status
  field :quantity, !types.Int, hash_key: :quantity
end
