class Mutations::UpdateTicket < Mutations::BaseMutation
  field :ticket, Types::TicketType, null: false

  argument :id, Int, required: true, camelize: false
  argument :ticket, Types::TicketInputType, required: true

  def resolve(id:, ticket:)
    ticket_model = convention.tickets.find(id)
    ticket_attrs = ticket.to_h
    ticket_attrs[:payment_amount] = MoneyHelper.coerce_money_input(ticket_attrs[:payment_amount])
    ticket_model.update!(ticket_attrs)

    { ticket: ticket_model }
  end
end
