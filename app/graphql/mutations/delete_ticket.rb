Mutations::DeleteTicket = GraphQL::Relay::Mutation.define do
  name 'DeleteTicket'
  return_field :ticket, Types::TicketType

  input_field :id, !types.Int
  input_field :refund, types.Boolean

  resolve ->(_obj, args, ctx) {
    ticket = ctx[:convention].tickets.find(args[:id])

    if args[:refund]
      raise 'Ticket cannot be refunded because there is no Stripe charge ID' unless ticket.charge_id
      charge = Stripe::Charge.retrieve(ticket.charge_id)

      Stripe::Refund.create(charge: ticket.charge_id) unless charge.refunded
    end

    ticket.destroy!

    { ticket: ticket }
  }
end
