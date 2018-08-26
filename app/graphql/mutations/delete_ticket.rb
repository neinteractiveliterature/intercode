Mutations::DeleteTicket = GraphQL::Relay::Mutation.define do
  name 'DeleteTicket'
  return_field :ticket, Types::TicketType

  input_field :id, !types.Int

  resolve ->(_obj, args, ctx) {
    ticket = ctx[:convention].tickets.find(args[:id])
    ticket.destroy!

    { ticket: ticket }
  }
end
