Mutations::UpdateTicketType = GraphQL::Relay::Mutation.define do
  name 'UpdateTicketType'
  return_field :ticket_type, Types::TicketTypeType

  input_field :id, !types.Int
  input_field :ticket_type, !Types::TicketTypeInputType

  resolve ->(_obj, args, ctx) {
    ticket_type = ctx[:convention].ticket_types.find(args[:id])
    ticket_type.update!(args[:ticket_type].to_h)

    { ticket_type: ticket_type }
  }
end
