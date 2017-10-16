IntercodeSchema = GraphQL::Schema.define do
  mutation(Types::MutationType)
  query(Types::QueryType)

  use GraphQL::Guard.new
end
