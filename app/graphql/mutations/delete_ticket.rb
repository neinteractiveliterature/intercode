Mutations::DeleteTicket = GraphQL::Relay::Mutation.define do
  name 'DeleteTicket'
  return_field :ticket, Types::TicketType

  input_field :id, !types.Int
  input_field :refund, types.Boolean

  resolve ->(_obj, args, ctx) {
    ticket = ctx[:convention].tickets.find(args[:id])
    DeleteTicketService.new(ticket: ticket, refund: args[:refund]).call!

    { ticket: ticket }
  }
end
