# frozen_string_literal: true
class Mutations::UpdateTicket < Mutations::BaseMutation
  field :ticket, Types::TicketType, null: false

  argument :id, ID, required: false
  argument :ticket, Types::TicketInputType, required: true

  load_and_authorize_convention_associated_model :tickets, :id, :update

  def resolve(**args)
    ticket.update!(args[:ticket].to_h)

    { ticket: ticket }
  end
end
