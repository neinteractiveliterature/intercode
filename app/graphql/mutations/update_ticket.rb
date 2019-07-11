class Mutations::UpdateTicket < Mutations::BaseMutation
  field :ticket, Types::TicketType, null: false

  argument :id, Int, required: true, camelize: false
  argument :ticket, Types::TicketInputType, required: true

  load_and_authorize_convention_associated_model :tickets, :id, :update

  def resolve(**args)
    ticket_attrs = args[:ticket].to_h
    ticket_attrs[:payment_amount] = MoneyHelper.coerce_money_input(ticket_attrs[:payment_amount])
    ticket.update!(ticket_attrs)

    { ticket: ticket }
  end
end
