Types::OrderInputType = GraphQL::InputObjectType.define do
  name 'OrderInput'
  input_field :payment_note, types.String
end
