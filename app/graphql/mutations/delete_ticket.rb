class Mutations::DeleteTicket < Mutations::BaseMutation
  field :ticket, Types::TicketType, null: false

  argument :id, Integer, required: true
  argument :refund, Boolean, required: false

  def resolve(**args)
    ticket = convention.tickets.find(args[:id])
    DeleteTicketService.new(ticket: ticket, refund: args[:refund]).call!

    { ticket: ticket }
  end
end
